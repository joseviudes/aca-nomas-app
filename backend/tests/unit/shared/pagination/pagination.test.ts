import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  paginationQuerySchema,
  toOffset,
  toPage,
} from '../../../../src/shared/pagination/pagination.js';

describe('paginationQuerySchema', () => {
  it('defaults to the first page of 20 items', () => {
    expect(paginationQuerySchema.parse({})).toEqual({ page: 1, limit: DEFAULT_PAGE_SIZE });
  });

  it('converts query strings to numbers', () => {
    expect(paginationQuerySchema.parse({ page: '3', limit: '10' })).toEqual({ page: 3, limit: 10 });
  });

  it.each([
    { page: '0' },
    { page: '-1' },
    { page: '1.5' },
    { limit: '0' },
    { limit: String(MAX_PAGE_SIZE + 1) },
  ])('rejects %o', (query) => {
    expect(paginationQuerySchema.safeParse(query).success).toBe(false);
  });
});

describe('toOffset', () => {
  it.each([
    { page: 1, limit: 20, offset: 0 },
    { page: 2, limit: 20, offset: 20 },
    { page: 3, limit: 10, offset: 20 },
  ])('page $page with limit $limit skips $offset', ({ page, limit, offset }) => {
    expect(toOffset({ page, limit })).toBe(offset);
  });
});

describe('toPage', () => {
  it('wraps the items with page, limit and total', () => {
    expect(toPage(['a', 'b'], 42, { page: 2, limit: 2 })).toEqual({
      data: ['a', 'b'],
      page: 2,
      limit: 2,
      total: 42,
    });
  });
});
