import { describe, expect, it } from 'vitest';
import { pageHref } from '@/modules/businesses/domain/pagination';

describe('pageHref', () => {
  it('links the first page to the home without a param', () => {
    expect(pageHref(1)).toBe('/');
  });

  it('puts the other pages in ?pagina=', () => {
    expect(pageHref(3)).toBe('/?pagina=3');
  });
});
