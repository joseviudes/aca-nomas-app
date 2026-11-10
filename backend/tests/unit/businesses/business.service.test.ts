import { describe, expect, it } from 'vitest';
import { businessListResponseSchema } from '../../../src/modules/businesses/schemas/business.schema.js';
import { BusinessService } from '../../../src/modules/businesses/services/business.service.js';
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

const bakery: BusinessListEntry = {
  slug: 'panaderia-la-espiga',
  name: 'Panadería La Espiga',
  photoKey: null,
  isPaused: false,
  category: { slug: 'panaderia', name: 'Panadería' },
};

const hardware: BusinessListEntry = {
  slug: 'ferreteria-el-tornillo',
  name: 'Ferretería El Tornillo',
  photoKey: 'businesses/el-tornillo.webp',
  isPaused: true,
  category: { slug: 'ferreteria', name: 'Ferretería' },
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
    const service = new BusinessService(new InMemoryBusinessRepository([bakery]));

    const result = await service.list({ page: 1, limit: 20 });

    expect(result.data).toEqual([
      {
        slug: 'panaderia-la-espiga',
        name: 'Panadería La Espiga',
        category: { slug: 'panaderia', name: 'Panadería' },
        photoUrl: null,
        status: { state: 'closed', closesAt: null, nextOpeningAt: null },
      },
    ]);
  });

  it('devuelve una respuesta que cumple el contrato del endpoint', async () => {
    const service = new BusinessService(new InMemoryBusinessRepository([bakery, hardware]));

    const result = await service.list({ page: 1, limit: 20 });

    expect(businessListResponseSchema.safeParse(result).success).toBe(true);
  });

  // Estado provisorio hasta HT-01 (isOpenNow).
  it('marca como pausado al negocio en pausa y como cerrado al resto', async () => {
    const service = new BusinessService(new InMemoryBusinessRepository([bakery, hardware]));

    const result = await service.list({ page: 1, limit: 20 });

    expect(result.data.map((business) => [business.slug, business.status.state])).toEqual([
      ['panaderia-la-espiga', 'closed'],
      ['ferreteria-el-tornillo', 'paused'],
    ]);
  });

  it('no expone la clave de la foto mientras no haya almacenamiento', async () => {
    const service = new BusinessService(new InMemoryBusinessRepository([hardware]));

    const [business] = (await service.list({ page: 1, limit: 20 })).data;

    expect(business?.photoUrl).toBeNull();
    expect(business).not.toHaveProperty('photoKey');
  });

  it('pide al repositorio la página y el tamaño de la consulta', async () => {
    const repository = new InMemoryBusinessRepository(entriesNamed(5));
    const service = new BusinessService(repository);

    await service.list({ page: 2, limit: 2 });

    expect(repository.lastPagination).toEqual({ page: 2, limit: 2 });
  });

  it('devuelve page, limit y el total de negocios, no solo los de la página', async () => {
    const service = new BusinessService(new InMemoryBusinessRepository(entriesNamed(45)));

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
    const service = new BusinessService(new InMemoryBusinessRepository(entriesNamed(3)));

    const result = await service.list({ page: 5, limit: 20 });

    expect(result).toEqual({ data: [], page: 5, limit: 20, total: 3 });
  });

  it('devuelve una lista vacía si no hay negocios cargados', async () => {
    const service = new BusinessService(new InMemoryBusinessRepository([]));

    const result = await service.list({ page: 1, limit: 20 });

    expect(result).toEqual({ data: [], page: 1, limit: 20, total: 0 });
  });
});
