import type { Prisma, PrismaClient } from '../../../generated/prisma/client.js';
import type { DayOfWeek, OpeningHours } from '../../opening-hours/domain/opening-hours.types.js';
import { toOffset } from '../../../shared/pagination/pagination.js';
import type {
  BusinessDetailEntry,
  BusinessListCriteria,
  BusinessListPage,
  BusinessRepository,
} from '../../../shared/ports/business.repository.js';

// PostgreSQL devuelve TIME y DATE como Date en UTC (1970-01-01T08:00:00Z, 2026-11-17T00:00:00Z).
// isOpenNow trabaja con las horas y la fecha locales tal como se guardaron, sin zona.
const toTime = (value: Date): string => value.toISOString().slice(11, 16);
const toDate = (value: Date): string => value.toISOString().slice(0, 10);

// Lo que hay que leer de la base para saber el estado y el horario de un negocio. Lo comparten el
// listado y la ficha: así los dos calculan el estado con los mismos datos.
const OPENING_HOURS_SELECT = {
  isPaused: true,
  closedTodayDate: true,
  locality: { select: { timezone: true } },
  openingHours: { select: { dayOfWeek: true, opensAt: true, closesAt: true } },
} as const;

interface OpeningHoursRow {
  isPaused: boolean;
  closedTodayDate: Date | null;
  openingHours: { dayOfWeek: number; opensAt: Date; closesAt: Date }[];
}

function toOpeningHours(row: OpeningHoursRow): OpeningHours {
  return {
    isPaused: row.isPaused,
    closedTodayDate: row.closedTodayDate ? toDate(row.closedTodayDate) : null,
    shifts: row.openingHours.map((shift) => ({
      // La base solo acepta de 1 a 7 (opening_hours_day_of_week_check).
      dayOfWeek: shift.dayOfWeek as DayOfWeek,
      opensAt: toTime(shift.opensAt),
      closesAt: toTime(shift.closesAt),
    })),
  };
}

export class PrismaBusinessRepository implements BusinessRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // US-02: ids de los negocios que tienen el texto en el nombre o en la descripción, sin importar
  // mayúsculas ni tildes (D-51). Prisma no tiene unaccent, por eso va en SQL. strpos busca el texto
  // tal cual: con ILIKE, un q con % o _ funcionaría como comodín. unaccent no es inmutable, así que
  // no usa índices: alcanza para los negocios de una localidad.
  private async findIdsMatching(text: string): Promise<string[]> {
    const rows = await this.prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM businesses
      WHERE strpos(lower(unaccent(name)), lower(unaccent(${text}::text))) > 0
         OR strpos(lower(unaccent(coalesce(description, ''))), lower(unaccent(${text}::text))) > 0`;
    return rows.map((row) => row.id);
  }

  async findPage(criteria: BusinessListCriteria): Promise<BusinessListPage> {
    // Cada filtro suma una condición y el negocio tiene que cumplirlas todas. El mismo where sirve
    // para la página y para el total, así el total cuenta lo que se filtró.
    const conditions: Prisma.BusinessWhereInput[] = [];
    if (criteria.category) conditions.push({ category: { slug: criteria.category } });
    if (criteria.q !== undefined) {
      conditions.push({ id: { in: await this.findIdsMatching(criteria.q) } });
    }
    const where: Prisma.BusinessWhereInput = { AND: conditions };

    // En una transacción, para que el total y la página se lean de la misma foto de la base.
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.business.findMany({
        where,
        select: {
          slug: true,
          name: true,
          photoKey: true,
          category: { select: { slug: true, name: true } },
          ...OPENING_HOURS_SELECT,
        },
        // RF-05: sin ubicación del visitante, el orden es por nombre. El slug es único y desempata
        // dos negocios con el mismo nombre, así ninguno se repite ni se pierde entre páginas.
        // "Abiertos primero" se suma con US-05.
        orderBy: [{ name: 'asc' }, { slug: 'asc' }],
        skip: toOffset(criteria),
        take: criteria.limit,
      }),
      this.prisma.business.count({ where }),
    ]);

    const items = rows.map((row) => ({
      slug: row.slug,
      name: row.name,
      photoKey: row.photoKey,
      category: row.category,
      timezone: row.locality.timezone,
      openingHours: toOpeningHours(row),
    }));

    return { items, total };
  }

  async findBySlug(slug: string): Promise<BusinessDetailEntry | null> {
    const row = await this.prisma.business.findUnique({
      where: { slug },
      select: {
        slug: true,
        name: true,
        description: true,
        photoKey: true,
        category: { select: { slug: true, name: true } },
        ...OPENING_HOURS_SELECT,
      },
    });
    if (!row) return null;

    return {
      slug: row.slug,
      name: row.name,
      description: row.description,
      photoKey: row.photoKey,
      category: row.category,
      timezone: row.locality.timezone,
      openingHours: toOpeningHours(row),
    };
  }
}
