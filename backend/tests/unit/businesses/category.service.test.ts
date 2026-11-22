import { describe, expect, it } from 'vitest';
import { categoryListResponseSchema } from '../../../src/modules/businesses/schemas/category.schema.js';
import { CategoryService } from '../../../src/modules/businesses/services/category.service.js';
import { toOffset, type PaginationQuery } from '../../../src/shared/pagination/pagination.js';
import type {
  CategoryEntry,
  CategoryPage,
  CategoryRepository,
} from '../../../src/shared/ports/category.repository.js';

// Repositorio falso en memoria: pagina los rubros que recibe y guarda con qué página lo llamaron.
class InMemoryCategoryRepository implements CategoryRepository {
  lastPagination: PaginationQuery | undefined;

  constructor(private readonly entries: CategoryEntry[]) {}

  findPage(pagination: PaginationQuery): Promise<CategoryPage> {
    this.lastPagination = pagination;
    const offset = toOffset(pagination);
    return Promise.resolve({
      items: this.entries.slice(offset, offset + pagination.limit),
      total: this.entries.length,
    });
  }
}

const CATEGORIES: CategoryEntry[] = [
  { slug: 'almacen', name: 'Almacén' },
  { slug: 'kiosco', name: 'Kiosco' },
  { slug: 'panaderia', name: 'Panadería' },
];

function serviceWith(entries: CategoryEntry[]) {
  const repository = new InMemoryCategoryRepository(entries);
  return { repository, service: new CategoryService(repository) };
}

describe('CategoryService.list', () => {
  it('devuelve los rubros con su slug y su nombre', async () => {
    const { service } = serviceWith(CATEGORIES);

    const result = await service.list({ page: 1, limit: 20 });

    expect(result).toEqual({ data: CATEGORIES, page: 1, limit: 20, total: 3 });
  });

  it('devuelve una respuesta que cumple el contrato del endpoint', async () => {
    const { service } = serviceWith(CATEGORIES);

    const result = await service.list({ page: 1, limit: 20 });

    expect(categoryListResponseSchema.safeParse(result).success).toBe(true);
  });

  it('pide al repositorio la página y el tamaño de la consulta', async () => {
    const { repository, service } = serviceWith(CATEGORIES);

    await service.list({ page: 2, limit: 2 });

    expect(repository.lastPagination).toEqual({ page: 2, limit: 2 });
  });

  it('devuelve el total de rubros, no solo los de la página', async () => {
    const { service } = serviceWith(CATEGORIES);

    const result = await service.list({ page: 2, limit: 2 });

    expect(result.data).toEqual([{ slug: 'panaderia', name: 'Panadería' }]);
    expect(result.total).toBe(3);
  });

  it('devuelve una página vacía, no un error, si la página está fuera de rango', async () => {
    const { service } = serviceWith(CATEGORIES);

    const result = await service.list({ page: 5, limit: 20 });

    expect(result).toEqual({ data: [], page: 5, limit: 20, total: 3 });
  });

  it('devuelve una lista vacía si no hay rubros cargados', async () => {
    const { service } = serviceWith([]);

    const result = await service.list({ page: 1, limit: 20 });

    expect(result).toEqual({ data: [], page: 1, limit: 20, total: 0 });
  });
});
