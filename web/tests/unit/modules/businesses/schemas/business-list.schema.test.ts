import { describe, expect, it } from 'vitest';
import {
  businessListResponseSchema,
  listPageParamSchema,
} from '@/modules/businesses/schemas/business-list.schema';

// El ejemplo de GET /businesses en Swagger (backend/src/modules/businesses/schemas/business.schema.ts).
const openApiExample = {
  data: [
    {
      slug: 'ferreteria-el-tornillo',
      name: 'Ferretería El Tornillo',
      category: { slug: 'ferreteria', name: 'Ferretería' },
      photoUrl: null,
      status: { state: 'paused', closesAt: null, nextOpeningAt: null },
    },
    {
      slug: 'kiosco-la-esquina',
      name: 'Kiosco La Esquina',
      category: { slug: 'kiosco', name: 'Kiosco' },
      photoUrl: null,
      status: { state: 'closed', closesAt: null, nextOpeningAt: null },
    },
  ],
  page: 3,
  limit: 2,
  total: 10,
};

const [firstItem] = openApiExample.data;

function withItem(item: Record<string, unknown>) {
  return { ...openApiExample, data: [item] };
}

describe('businessListResponseSchema', () => {
  it('accepts the contract example', () => {
    expect(businessListResponseSchema.parse(openApiExample)).toEqual(openApiExample);
  });

  it('accepts an open business with its closing time and a photo', () => {
    const open = {
      ...firstItem,
      photoUrl: 'https://example.com/foto.jpg',
      status: { state: 'open', closesAt: '2026-11-17T23:00:00Z', nextOpeningAt: null },
    };

    expect(businessListResponseSchema.safeParse(withItem(open)).success).toBe(true);
  });

  it('rejects a response without total', () => {
    const withoutTotal: Partial<typeof openApiExample> = { ...openApiExample };
    delete withoutTotal.total;

    expect(businessListResponseSchema.safeParse(withoutTotal).success).toBe(false);
  });

  it('rejects an unknown state', () => {
    const unknown = { ...firstItem, status: { ...firstItem.status, state: 'busy' } };

    expect(businessListResponseSchema.safeParse(withItem(unknown)).success).toBe(false);
  });

  it('rejects a limit over 100', () => {
    expect(businessListResponseSchema.safeParse({ ...openApiExample, limit: 101 }).success).toBe(
      false,
    );
  });

  it('rejects a closesAt that is not an ISO date', () => {
    const badDate = { ...firstItem, status: { ...firstItem.status, closesAt: '23:00' } };

    expect(businessListResponseSchema.safeParse(withItem(badDate)).success).toBe(false);
  });
});

describe('listPageParamSchema', () => {
  it('turns the query param into a number', () => {
    expect(listPageParamSchema.parse('3')).toBe(3);
  });

  it('takes the first value when the param is repeated', () => {
    expect(listPageParamSchema.parse(['2', '5'])).toBe(2);
  });

  it.each([undefined, '', '0', '-1', '1.5', 'abc'])('falls back to page 1 for %s', (value) => {
    expect(listPageParamSchema.parse(value)).toBe(1);
  });
});
