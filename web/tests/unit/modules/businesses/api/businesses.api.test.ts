import { describe, expect, it } from 'vitest';
import { listBusinesses } from '@/modules/businesses/api/businesses.api';

describe('listBusinesses', () => {
  it('returns the first page with 20 businesses by default', async () => {
    const result = await listBusinesses();

    expect(result).toMatchObject({ page: 1, limit: 20, total: 25 });
    expect(result.data).toHaveLength(20);
  });

  it('returns the rest on the next page', async () => {
    const result = await listBusinesses({ page: 2 });

    expect(result.data).toHaveLength(5);
  });

  it('returns no businesses for a page out of range', async () => {
    const result = await listBusinesses({ page: 9 });

    expect(result).toMatchObject({ page: 9, total: 25, data: [] });
  });
});
