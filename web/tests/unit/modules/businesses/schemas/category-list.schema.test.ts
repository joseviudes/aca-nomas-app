import { describe, expect, it } from 'vitest';
import {
  categoryListResponseSchema,
  listCategoryParamSchema,
} from '@/modules/businesses/schemas/category-list.schema';

// El ejemplo de GET /categories en Swagger (backend/src/modules/businesses/schemas/category.schema.ts).
const openApiExample = {
  data: [
    { slug: 'almacen', name: 'Almacén' },
    { slug: 'bicicleteria', name: 'Bicicletería' },
    { slug: 'cafeteria', name: 'Cafetería' },
  ],
  page: 1,
  limit: 3,
  total: 10,
};

describe('categoryListResponseSchema', () => {
  it('accepts the contract example', () => {
    expect(categoryListResponseSchema.parse(openApiExample)).toEqual(openApiExample);
  });

  it('accepts an empty list', () => {
    const empty = { data: [], page: 1, limit: 100, total: 0 };

    expect(categoryListResponseSchema.safeParse(empty).success).toBe(true);
  });

  it('rejects a category without name', () => {
    const withoutName = { ...openApiExample, data: [{ slug: 'almacen' }] };

    expect(categoryListResponseSchema.safeParse(withoutName).success).toBe(false);
  });

  it('rejects a response without total', () => {
    const withoutTotal: Partial<typeof openApiExample> = { ...openApiExample };
    delete withoutTotal.total;

    expect(categoryListResponseSchema.safeParse(withoutTotal).success).toBe(false);
  });

  it('rejects a limit over 100', () => {
    expect(categoryListResponseSchema.safeParse({ ...openApiExample, limit: 101 }).success).toBe(
      false,
    );
  });
});

describe('listCategoryParamSchema', () => {
  it.each(['panaderia', 'mercado-central', 'kiosco24'])('keeps the slug %s', (value) => {
    expect(listCategoryParamSchema.parse(value)).toBe(value);
  });

  it('lowercases and trims the slug, like the API', () => {
    expect(listCategoryParamSchema.parse('  Panaderia ')).toBe('panaderia');
  });

  it('takes the first value when the param is repeated', () => {
    expect(listCategoryParamSchema.parse(['kiosco', 'almacen'])).toBe('kiosco');
  });

  it.each([123, null, ['', 'kiosco'], {}])('means all categories for the non-text %j', (value) => {
    expect(listCategoryParamSchema.parse(value)).toBeUndefined();
  });

  it.each([undefined, '', '   '])('means all categories for %j', (value) => {
    expect(listCategoryParamSchema.parse(value)).toBeUndefined();
  });

  it.each(['pan aderia', 'panadería', '-panaderia', 'panaderia-', 'pan--aderia', 'a/b'])(
    'means all categories for the malformed %j',
    (value) => {
      expect(listCategoryParamSchema.parse(value)).toBeUndefined();
    },
  );
});
