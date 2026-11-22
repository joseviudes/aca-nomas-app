import { describe, expect, it } from 'vitest';
import { listHref } from '@/modules/businesses/domain/list-href';

describe('listHref', () => {
  it('links the first page of all categories to the home without params', () => {
    expect(listHref()).toBe('/');
    expect(listHref({ page: 1 })).toBe('/');
  });

  it('puts the other pages in ?pagina=', () => {
    expect(listHref({ page: 3 })).toBe('/?pagina=3');
  });

  it('puts the category in ?rubro= and leaves the first page without param', () => {
    expect(listHref({ category: 'panaderia' })).toBe('/?rubro=panaderia');
  });

  it('keeps the category when changing page', () => {
    expect(listHref({ page: 2, category: 'panaderia' })).toBe('/?rubro=panaderia&pagina=2');
  });

  it('encodes the category', () => {
    expect(listHref({ category: 'a&b' })).toBe('/?rubro=a%26b');
  });
});
