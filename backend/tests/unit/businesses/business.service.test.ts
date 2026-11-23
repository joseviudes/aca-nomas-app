import { describe, expect, it } from 'vitest';
import {
  businessDetailSchema,
  businessListResponseSchema,
} from '../../../src/modules/businesses/schemas/business.schema.js';
import { BusinessService } from '../../../src/modules/businesses/services/business.service.js';
import type { OpeningHours } from '../../../src/modules/opening-hours/domain/opening-hours.types.js';
import { OpeningHoursService } from '../../../src/modules/opening-hours/services/opening-hours.service.js';
import { toOffset } from '../../../src/shared/pagination/pagination.js';
import { NotFoundError } from '../../../src/shared/errors/http-errors.js';
import type {
  BusinessDetailEntry,
  BusinessListCriteria,
  BusinessListEntry,
  BusinessListPage,
  BusinessRepository,
} from '../../../src/shared/ports/business.repository.js';

// Repositorio falso en memoria: filtra por texto y por rubro, pagina la lista que recibe y guarda con qué
// criterios lo llamaron.
// Las fichas van aparte porque llevan datos que el listado no trae, como la descripción.
class InMemoryBusinessRepository implements BusinessRepository {
  lastCriteria: BusinessListCriteria | undefined;

  constructor(
    private readonly entries: BusinessListEntry[],
    private readonly details: BusinessDetailEntry[] = [],
  ) {}

  findBySlug(slug: string): Promise<BusinessDetailEntry | null> {
    return Promise.resolve(this.details.find((detail) => detail.slug === slug) ?? null);
  }

  findPage(criteria: BusinessListCriteria): Promise<BusinessListPage> {
    this.lastCriteria = criteria;
    const matching = this.entries.filter(
      (entry) =>
        (!criteria.category || entry.category.slug === criteria.category) &&
        (!criteria.q || entry.name.toLowerCase().includes(criteria.q.toLowerCase())),
    );
    const offset = toOffset(criteria);
    return Promise.resolve({
      items: matching.slice(offset, offset + criteria.limit),
      total: matching.length,
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

    expect(repository.lastCriteria).toMatchObject({ page: 2, limit: 2 });
  });

  describe('filtro por rubro (US-03)', () => {
    const bakery2 = { ...bakery, slug: 'panaderia-don-jose', name: 'Panadería Don José' };

    it('pide al repositorio el rubro de la consulta', async () => {
      const { repository, service } = serviceWith([bakery]);

      await service.list({ page: 1, limit: 20, category: 'panaderia' });

      expect(repository.lastCriteria).toEqual({ page: 1, limit: 20, category: 'panaderia' });
    });

    it('lista solo los negocios del rubro y cuenta solo esos en el total', async () => {
      const { service } = serviceWith([bakery, hardware, bakery2]);

      const result = await service.list({ page: 1, limit: 20, category: 'panaderia' });

      expect(result.data.map((business) => business.slug)).toEqual([
        'panaderia-la-espiga',
        'panaderia-don-jose',
      ]);
      expect(result.total).toBe(2);
    });

    it('pagina dentro del rubro elegido', async () => {
      const { service } = serviceWith([bakery, hardware, bakery2]);

      const result = await service.list({ page: 2, limit: 1, category: 'panaderia' });

      expect(result.data.map((business) => business.slug)).toEqual(['panaderia-don-jose']);
      expect(result).toMatchObject({ page: 2, limit: 1, total: 2 });
    });

    it('sin rubro lista todos los negocios', async () => {
      const { service } = serviceWith([bakery, hardware, bakery2]);

      const result = await service.list({ page: 1, limit: 20 });

      expect(result.total).toBe(3);
    });

    it('devuelve una lista vacía, no un error, si el rubro no existe', async () => {
      const { service } = serviceWith([bakery, hardware]);

      const result = await service.list({ page: 1, limit: 20, category: 'astrologia' });

      expect(result).toEqual({ data: [], page: 1, limit: 20, total: 0 });
    });
  });

  // El repositorio falso solo busca el texto en el nombre, sin mayúsculas. Las tildes y la
  // descripción las resuelve la base (D-51), así que se prueban contra la base con el seed.
  describe('búsqueda por texto (US-02)', () => {
    const hardware2 = { ...hardware, slug: 'ferreteria-don-jose', name: 'Ferretería Don José' };
    const bakery2 = { ...bakery, slug: 'panaderia-don-jose', name: 'Panadería Don José' };

    it('pide al repositorio el texto de la consulta', async () => {
      const { repository, service } = serviceWith([bakery]);

      await service.list({ page: 1, limit: 20, q: 'espiga' });

      expect(repository.lastCriteria).toEqual({ page: 1, limit: 20, q: 'espiga' });
    });

    it('lista solo los negocios encontrados y cuenta solo esos en el total', async () => {
      const { service } = serviceWith([bakery, hardware, bakery2]);

      const result = await service.list({ page: 1, limit: 20, q: 'don josé' });

      expect(result.data.map((business) => business.slug)).toEqual(['panaderia-don-jose']);
      expect(result.total).toBe(1);
    });

    it('se combina con el rubro: el negocio tiene que cumplir los dos', async () => {
      const { repository, service } = serviceWith([bakery, bakery2, hardware2]);

      const result = await service.list({ page: 1, limit: 20, q: 'don', category: 'ferreteria' });

      expect(repository.lastCriteria).toEqual({
        page: 1,
        limit: 20,
        q: 'don',
        category: 'ferreteria',
      });
      expect(result.data.map((business) => business.slug)).toEqual(['ferreteria-don-jose']);
      expect(result.total).toBe(1);
    });

    it('pagina dentro de lo encontrado', async () => {
      const { service } = serviceWith([bakery, bakery2, hardware2]);

      const result = await service.list({ page: 2, limit: 1, q: 'don josé' });

      expect(result.data.map((business) => business.slug)).toEqual(['ferreteria-don-jose']);
      expect(result).toMatchObject({ page: 2, limit: 1, total: 2 });
    });

    it('devuelve una lista vacía, no un error, si nada coincide', async () => {
      const { service } = serviceWith([bakery, hardware]);

      const result = await service.list({ page: 1, limit: 20, q: 'astrologia' });

      expect(result).toEqual({ data: [], page: 1, limit: 20, total: 0 });
    });
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
    const failingRepository: BusinessRepository = {
      findPage: () => Promise.reject(failure),
      findBySlug: () => Promise.reject(failure),
    };
    const service = new BusinessService(failingRepository, new OpeningHoursService());

    await expect(service.list({ page: 1, limit: 20 })).rejects.toBe(failure);
  });
});

describe('BusinessService.getBySlug', () => {
  const bakeryDetail: BusinessDetailEntry = {
    slug: 'panaderia-la-espiga',
    name: 'Panadería La Espiga',
    description: 'Pan casero, facturas y tortas por encargo.',
    photoKey: 'businesses/la-espiga.webp',
    category: { slug: 'panaderia', name: 'Panadería' },
    openingHours: MORNING_SHIFTS,
    timezone: TIMEZONE,
  };

  function serviceWithDetails(details: BusinessDetailEntry[]) {
    return new BusinessService(
      new InMemoryBusinessRepository([], details),
      new OpeningHoursService(() => TUESDAY_10_AM),
    );
  }

  it('devuelve la ficha del negocio con ese slug', async () => {
    const service = serviceWithDetails([bakeryDetail]);

    const detail = await service.getBySlug('panaderia-la-espiga');

    expect(detail).toEqual({
      slug: 'panaderia-la-espiga',
      name: 'Panadería La Espiga',
      description: 'Pan casero, facturas y tortas por encargo.',
      category: { slug: 'panaderia', name: 'Panadería' },
      photoUrl: null,
      status: { state: 'open', closesAt: '2026-11-17T16:00:00.000Z', nextOpeningAt: null },
      schedule: expect.objectContaining({ timezone: TIMEZONE, today: 2 }) as unknown,
    });
    expect(businessDetailSchema.safeParse(detail).success).toBe(true);
  });

  describe('estado', () => {
    it('está abierto con la hora de cierre dentro del turno', async () => {
      const detail = await serviceWithDetails([bakeryDetail]).getBySlug('panaderia-la-espiga');

      expect(detail.status).toEqual({
        state: 'open',
        closesAt: '2026-11-17T16:00:00.000Z',
        nextOpeningAt: null,
      });
    });

    it('está cerrado con la próxima apertura fuera del turno', async () => {
      const afternoon = new Date('2026-11-17T20:00:00Z');
      const service = new BusinessService(
        new InMemoryBusinessRepository([], [bakeryDetail]),
        new OpeningHoursService(() => afternoon),
      );

      const detail = await service.getBySlug('panaderia-la-espiga');

      expect(detail.status).toEqual({
        state: 'closed',
        closesAt: null,
        nextOpeningAt: '2026-11-18T10:00:00.000Z',
      });
    });

    it('un negocio en pausa figura pausado aunque esté dentro del horario', async () => {
      const paused = { ...bakeryDetail, openingHours: { ...MORNING_SHIFTS, isPaused: true } };

      const detail = await serviceWithDetails([paused]).getBySlug('panaderia-la-espiga');

      expect(detail.status).toEqual({ state: 'paused', closesAt: null, nextOpeningAt: null });
    });

    it('si el dueño avisó que hoy no abre, figura "hoy no abre"', async () => {
      const closedToday = {
        ...bakeryDetail,
        openingHours: { ...MORNING_SHIFTS, closedTodayDate: '2026-11-17' },
      };

      const detail = await serviceWithDetails([closedToday]).getBySlug('panaderia-la-espiga');

      expect(detail.status).toMatchObject({ state: 'closed_today', closesAt: null });
    });

    it('un negocio sin turnos cargados está cerrado y sin próxima apertura', async () => {
      const empty = { ...bakeryDetail, openingHours: hours() };

      const detail = await serviceWithDetails([empty]).getBySlug('panaderia-la-espiga');

      expect(detail.status).toEqual({ state: 'closed', closesAt: null, nextOpeningAt: null });
    });
  });

  describe('horario semanal', () => {
    it('trae los 7 días con los turnos en hora local de la localidad', async () => {
      const detail = await serviceWithDetails([bakeryDetail]).getBySlug('panaderia-la-espiga');

      expect(detail.schedule.days).toHaveLength(7);
      expect(detail.schedule.days[1]).toEqual({
        dayOfWeek: 2,
        shifts: [{ opensAt: '07:00', closesAt: '13:00' }],
      });
      expect(detail.schedule.days[0]?.shifts).toEqual([]);
    });

    it('marca como hoy el día de la localidad, no el del servidor', async () => {
      // 01:00 UTC del miércoles es todavía martes 22:00 en Mantilla.
      const service = new BusinessService(
        new InMemoryBusinessRepository([], [bakeryDetail]),
        new OpeningHoursService(() => new Date('2026-11-18T01:00:00Z')),
      );

      const detail = await service.getBySlug('panaderia-la-espiga');

      expect(detail.schedule.today).toBe(2);
    });

    it('un negocio en pausa conserva su horario', async () => {
      const paused = { ...bakeryDetail, openingHours: { ...MORNING_SHIFTS, isPaused: true } };

      const detail = await serviceWithDetails([paused]).getBySlug('panaderia-la-espiga');

      expect(detail.schedule.days[1]?.shifts).toHaveLength(1);
    });
  });

  it('devuelve la descripción en null si el negocio no tiene', async () => {
    const service = serviceWithDetails([{ ...bakeryDetail, description: null }]);

    const detail = await service.getBySlug('panaderia-la-espiga');

    expect(detail.description).toBeNull();
  });

  it('no expone la clave de la foto mientras no haya almacenamiento', async () => {
    const service = serviceWithDetails([bakeryDetail]);

    const detail = await service.getBySlug('panaderia-la-espiga');

    expect(detail.photoUrl).toBeNull();
    expect(detail).not.toHaveProperty('photoKey');
  });

  it.each(['panaderia-el-trigo', 'Panaderia-La-Espiga', 'panadería-la-espiga'])(
    'responde BUSINESS_NOT_FOUND con %o, que ningún negocio tiene',
    async (slug) => {
      const service = serviceWithDetails([bakeryDetail]);

      const error: unknown = await service.getBySlug(slug).catch((caught: unknown) => caught);

      expect(error).toBeInstanceOf(NotFoundError);
      expect(error).toMatchObject({ statusCode: 404, code: 'BUSINESS_NOT_FOUND' });
    },
  );

  it('deja pasar el error del repositorio en vez de responder 404', async () => {
    const failure = new Error('Se cortó la conexión con la base');
    const failingRepository: BusinessRepository = {
      findPage: () => Promise.reject(failure),
      findBySlug: () => Promise.reject(failure),
    };
    const service = new BusinessService(failingRepository, new OpeningHoursService());

    await expect(service.getBySlug('panaderia-la-espiga')).rejects.toBe(failure);
  });
});
