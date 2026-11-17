import { describe, expect, it } from 'vitest';
import { businessListResponseSchema } from '../../../src/modules/businesses/schemas/business.schema.js';
import { BusinessService } from '../../../src/modules/businesses/services/business.service.js';
import type { OpeningHours } from '../../../src/modules/opening-hours/domain/opening-hours.types.js';
import { OpeningHoursService } from '../../../src/modules/opening-hours/services/opening-hours.service.js';
import { toOffset, type PaginationQuery } from '../../../src/shared/pagination/pagination.js';
import type {
  BusinessListEntry,
  BusinessListPage,
  BusinessRepository,
} from '../../../src/shared/ports/business.repository.js';

// Repositorio falso en memoria: pagina la lista que recibe y guarda con qué página lo llamaron.
class InMemoryBusinessRepository implements BusinessRepository {
  lastPagination: PaginationQuery | undefined;

  constructor(private readonly entries: BusinessListEntry[]) {}

  findPage(pagination: PaginationQuery): Promise<BusinessListPage> {
    this.lastPagination = pagination;
    const offset = toOffset(pagination);
    return Promise.resolve({
      items: this.entries.slice(offset, offset + pagination.limit),
      total: this.entries.length,
    });
  }
}

const TIMEZONE = 'America/Argentina/Buenos_Aires';

// Martes 17/11/2026 a las 10:00 de Mantilla (UTC-3).
const TUESDAY_10_AM = new Date('2026-11-17T13:00:00Z');

// El reloj queda fijo: el estado de cada negocio depende de la hora de la consulta.
function serviceWith(entries: BusinessListEntry[], now = TUESDAY_10_AM) {
  const repository = new InMemoryBusinessRepository(entries);
  const service = new BusinessService(repository, new OpeningHoursService(() => now));
  return { repository, service };
}

function hours(overrides: Partial<OpeningHours> = {}): OpeningHours {
  return { isPaused: false, closedTodayDate: null, shifts: [], ...overrides };
}

// Abre de 07:00 a 13:00 el martes (2) y el miércoles (3).
const MORNING_SHIFTS = hours({
  shifts: [
    { dayOfWeek: 2, opensAt: '07:00', closesAt: '13:00' },
    { dayOfWeek: 3, opensAt: '07:00', closesAt: '13:00' },
  ],
});

const bakery: BusinessListEntry = {
  slug: 'panaderia-la-espiga',
  name: 'Panadería La Espiga',
  photoKey: null,
  category: { slug: 'panaderia', name: 'Panadería' },
  openingHours: MORNING_SHIFTS,
  timezone: TIMEZONE,
};

const hardware: BusinessListEntry = {
  slug: 'ferreteria-el-tornillo',
  name: 'Ferretería El Tornillo',
  photoKey: 'businesses/el-tornillo.webp',
  category: { slug: 'ferreteria', name: 'Ferretería' },
  openingHours: { ...MORNING_SHIFTS, isPaused: true },
  timezone: TIMEZONE,
};

function entriesNamed(count: number): BusinessListEntry[] {
  return Array.from({ length: count }, (_, index) => ({
    ...bakery,
    slug: `negocio-${index + 1}`,
    name: `Negocio ${index + 1}`,
  }));
}

describe('BusinessService.list', () => {
  it('arma la tarjeta de cada negocio con nombre, rubro, foto y estado', async () => {
    const { service } = serviceWith([bakery]);

    const result = await service.list({ page: 1, limit: 20 });

    expect(result.data).toEqual([
      {
        slug: 'panaderia-la-espiga',
        name: 'Panadería La Espiga',
        category: { slug: 'panaderia', name: 'Panadería' },
        photoUrl: null,
        // Abierta hasta las 13:00 de Mantilla, en UTC.
        status: { state: 'open', closesAt: '2026-11-17T16:00:00.000Z', nextOpeningAt: null },
      },
    ]);
  });

  it('devuelve una respuesta que cumple el contrato del endpoint', async () => {
    const { service } = serviceWith([bakery, hardware]);

    const result = await service.list({ page: 1, limit: 20 });

    expect(businessListResponseSchema.safeParse(result).success).toBe(true);
  });

  // Los cuatro estados de RN-01, a la misma hora, con su hora de cierre o su próxima apertura.
  it('calcula el estado de cada negocio con su horario a la hora de la consulta', async () => {
    const entry = (slug: string, openingHours: OpeningHours): BusinessListEntry => ({
      ...bakery,
      slug,
      openingHours,
    });
    const { service } = serviceWith([
      entry('abierto', MORNING_SHIFTS),
      entry('cerrado', hours({ shifts: [{ dayOfWeek: 2, opensAt: '16:00', closesAt: '20:00' }] })),
      entry('hoy-no-abre', { ...MORNING_SHIFTS, closedTodayDate: '2026-11-17' }),
      entry('pausado', { ...MORNING_SHIFTS, isPaused: true }),
      entry('sin-turnos', hours()),
    ]);

    const result = await service.list({ page: 1, limit: 20 });

    expect(result.data.map(({ slug, status }) => [slug, status])).toEqual([
      ['abierto', { state: 'open', closesAt: '2026-11-17T16:00:00.000Z', nextOpeningAt: null }],
      ['cerrado', { state: 'closed', closesAt: null, nextOpeningAt: '2026-11-17T19:00:00.000Z' }],
      // Vuelve a abrir el miércoles a las 07:00, no en un turno de hoy.
      [
        'hoy-no-abre',
        { state: 'closed_today', closesAt: null, nextOpeningAt: '2026-11-18T10:00:00.000Z' },
      ],
      ['pausado', { state: 'paused', closesAt: null, nextOpeningAt: null }],
      ['sin-turnos', { state: 'closed', closesAt: null, nextOpeningAt: null }],
    ]);
  });

  it('usa la zona horaria de la localidad del negocio, no la del servidor', async () => {
    // A las 13:00 UTC, el turno de 07:00 a 13:00 ya cerró en UTC, pero sigue abierto en Mantilla.
    const { service } = serviceWith([bakery, { ...bakery, slug: 'en-utc', timezone: 'UTC' }]);

    const result = await service.list({ page: 1, limit: 20 });

    expect(result.data.map(({ slug, status }) => [slug, status.state])).toEqual([
      ['panaderia-la-espiga', 'open'],
      ['en-utc', 'closed'],
    ]);
  });

  it('no expone la clave de la foto mientras no haya almacenamiento', async () => {
    const { service } = serviceWith([hardware]);

    const [business] = (await service.list({ page: 1, limit: 20 })).data;

    expect(business?.photoUrl).toBeNull();
    expect(business).not.toHaveProperty('photoKey');
  });

  it('pide al repositorio la página y el tamaño de la consulta', async () => {
    const { repository, service } = serviceWith(entriesNamed(5));

    await service.list({ page: 2, limit: 2 });

    expect(repository.lastPagination).toEqual({ page: 2, limit: 2 });
  });

  it('devuelve page, limit y el total de negocios, no solo los de la página', async () => {
    const { service } = serviceWith(entriesNamed(45));

    const result = await service.list({ page: 3, limit: 20 });

    expect(result).toMatchObject({ page: 3, limit: 20, total: 45 });
    expect(result.data.map((business) => business.slug)).toEqual([
      'negocio-41',
      'negocio-42',
      'negocio-43',
      'negocio-44',
      'negocio-45',
    ]);
  });

  it('devuelve una página vacía, no un error, si la página está fuera de rango', async () => {
    const { service } = serviceWith(entriesNamed(3));

    const result = await service.list({ page: 5, limit: 20 });

    expect(result).toEqual({ data: [], page: 5, limit: 20, total: 3 });
  });

  it('devuelve una lista vacía si no hay negocios cargados', async () => {
    const { service } = serviceWith([]);

    const result = await service.list({ page: 1, limit: 20 });

    expect(result).toEqual({ data: [], page: 1, limit: 20, total: 0 });
  });

  // El servicio no tiene errores propios: el único que puede pasar es que falle la base. Tiene que
  // llegar al middleware de errores (500), no convertirse en una lista vacía que diga "no hay negocios".
  it('deja pasar el error del repositorio en vez de devolver una lista vacía', async () => {
    const failure = new Error('Se cortó la conexión con la base');
    const failingRepository: BusinessRepository = { findPage: () => Promise.reject(failure) };
    const service = new BusinessService(failingRepository, new OpeningHoursService());

    await expect(service.list({ page: 1, limit: 20 })).rejects.toBe(failure);
  });
});
