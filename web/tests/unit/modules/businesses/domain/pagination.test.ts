import { describe, expect, it } from 'vitest';
import {
  hasNextPage,
  hasPreviousPage,
  pageHref,
  totalPages,
} from '@/modules/businesses/domain/pagination';

describe('totalPages', () => {
  it('rounds up the last, incomplete page', () => {
    expect(totalPages({ limit: 20, total: 25 })).toBe(2);
  });

  it('counts exact pages', () => {
    expect(totalPages({ limit: 20, total: 40 })).toBe(2);
  });

  it('is 0 without businesses', () => {
    expect(totalPages({ limit: 20, total: 0 })).toBe(0);
  });
});

describe('hasPreviousPage', () => {
  it('is false on the first page', () => {
    expect(hasPreviousPage({ page: 1 })).toBe(false);
  });

  it('is true after the first page', () => {
    expect(hasPreviousPage({ page: 2 })).toBe(true);
  });
});

describe('hasNextPage', () => {
  it('is true before the last page', () => {
    expect(hasNextPage({ page: 1, limit: 20, total: 25 })).toBe(true);
  });

  it('is false on the last page', () => {
    expect(hasNextPage({ page: 2, limit: 20, total: 25 })).toBe(false);
  });

  it('is false on a page out of range', () => {
    expect(hasNextPage({ page: 9, limit: 20, total: 25 })).toBe(false);
  });
});

describe('pageHref', () => {
  it('links the first page to the home without a param', () => {
    expect(pageHref(1)).toBe('/');
  });

  it('puts the other pages in ?pagina=', () => {
    expect(pageHref(3)).toBe('/?pagina=3');
  });
});
