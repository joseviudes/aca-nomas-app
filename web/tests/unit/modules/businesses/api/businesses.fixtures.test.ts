import { describe, expect, it } from 'vitest';
import {
  businessListFixture,
  categoryListFixture,
} from '@/modules/businesses/api/businesses.fixtures';

// Los datos de ejemplo tienen que comportarse como la API, porque las pruebas se apoyan en ellos.
describe('businessListFixture', () => {
  it('filters by category and counts only that category', () => {
    const result = businessListFixture({ page: 1, limit: 20, category: 'panaderia' });

    expect(result.total).toBe(3);
    expect(result.data.every((business) => business.category.slug === 'panaderia')).toBe(true);
  });

  it('returns an empty page with the category total for a page out of range', () => {
    expect(businessListFixture({ page: 2, limit: 20, category: 'panaderia' })).toEqual({
      data: [],
      page: 2,
      limit: 20,
      total: 3,
    });
  });

  it('returns an empty list with total 0 for a category that does not exist', () => {
    expect(businessListFixture({ page: 1, limit: 20, category: 'heladeria' })).toMatchObject({
      data: [],
      total: 0,
    });
  });
});

describe('categoryListFixture', () => {
  it('sorts the categories by name, like the API', () => {
    const names = categoryListFixture().data.map(({ name }) => name);

    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'es')));
    expect(names[0]).toBe('Almacén');
  });
});
