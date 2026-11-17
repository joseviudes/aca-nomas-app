import type { PrismaClient } from '../../../generated/prisma/client.js';
import type { DayOfWeek } from '../../opening-hours/domain/opening-hours.types.js';
import { toOffset, type PaginationQuery } from '../../../shared/pagination/pagination.js';
import type {
  BusinessListPage,
  BusinessRepository,
} from '../../../shared/ports/business.repository.js';

// PostgreSQL devuelve TIME y DATE como Date en UTC (1970-01-01T08:00:00Z, 2026-11-17T00:00:00Z).
// isOpenNow trabaja con las horas y la fecha locales tal como se guardaron, sin zona.
const toTime = (value: Date): string => value.toISOString().slice(11, 16);
const toDate = (value: Date): string => value.toISOString().slice(0, 10);

export class PrismaBusinessRepository implements BusinessRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findPage(pagination: PaginationQuery): Promise<BusinessListPage> {
    // En una transacción, para que el total y la página se lean de la misma foto de la base.
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.business.findMany({
        select: {
          slug: true,
          name: true,
          photoKey: true,
          isPaused: true,
          closedTodayDate: true,
          category: { select: { slug: true, name: true } },
          locality: { select: { timezone: true } },
          openingHours: { select: { dayOfWeek: true, opensAt: true, closesAt: true } },
        },
        // RF-05: sin ubicación del visitante, el orden es por nombre. El slug es único y desempata
        // dos negocios con el mismo nombre, así ninguno se repite ni se pierde entre páginas.
        // "Abiertos primero" se suma con US-05.
        orderBy: [{ name: 'asc' }, { slug: 'asc' }],
        skip: toOffset(pagination),
        take: pagination.limit,
      }),
      this.prisma.business.count(),
    ]);

    const items = rows.map((row) => ({
      slug: row.slug,
      name: row.name,
      photoKey: row.photoKey,
      category: row.category,
      timezone: row.locality.timezone,
      openingHours: {
        isPaused: row.isPaused,
        closedTodayDate: row.closedTodayDate ? toDate(row.closedTodayDate) : null,
        shifts: row.openingHours.map((shift) => ({
          // La base solo acepta de 1 a 7 (opening_hours_day_of_week_check).
          dayOfWeek: shift.dayOfWeek as DayOfWeek,
          opensAt: toTime(shift.opensAt),
          closesAt: toTime(shift.closesAt),
        })),
      },
    }));

    return { items, total };
  }
}
