import { describe, expect, it } from 'vitest';
import { activeCategory } from '@/modules/businesses/domain/active-category';

const categories = [
  { slug: 'almacen', name: 'Almacén' },
  { slug: 'panaderia', name: 'Panadería' },
];

describe('activeCategory', () => {
  it('keeps a category that exists', () => {
    expect(activeCategory(categories, 'panaderia')).toBe('panaderia');
  });

  it('marks "Todo" for a category that does not exist', () => {
    expect(activeCategory(categories, 'heladeria')).toBeUndefined();
  });

  it('marks "Todo" without a category', () => {
    expect(activeCategory(categories, undefined)).toBeUndefined();
  });

  it('marks "Todo" when there are no categories', () => {
    expect(activeCategory([], 'panaderia')).toBeUndefined();
  });
});
