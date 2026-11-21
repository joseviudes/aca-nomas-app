import { describe, expect, it } from 'vitest';
import { businessDetailSchema } from '@/modules/businesses/schemas/business-detail.schema';

// El ejemplo de Swagger (backend/src/modules/businesses/schemas/business.schema.ts).
const swaggerExample = {
  slug: 'panaderia-la-espiga',
  name: 'Panadería La Espiga',
  description: 'Pan casero, facturas y tortas por encargo.',
  category: { slug: 'panaderia', name: 'Panadería' },
  photoUrl: null,
};

describe('businessDetailSchema', () => {
  it('accepts the Swagger example', () => {
    expect(businessDetailSchema.parse(swaggerExample)).toEqual(swaggerExample);
  });

  it('accepts a business without description', () => {
    expect(businessDetailSchema.safeParse({ ...swaggerExample, description: null }).success).toBe(
      true,
    );
  });

  it('accepts a photo URL', () => {
    const withPhoto = { ...swaggerExample, photoUrl: 'https://example.com/foto.jpg' };
    expect(businessDetailSchema.safeParse(withPhoto).success).toBe(true);
  });

  it('rejects a description longer than 80 characters', () => {
    const tooLong = { ...swaggerExample, description: 'a'.repeat(81) };
    expect(businessDetailSchema.safeParse(tooLong).success).toBe(false);
  });

  it('rejects a photoUrl that is not a URL', () => {
    expect(businessDetailSchema.safeParse({ ...swaggerExample, photoUrl: 'foto' }).success).toBe(
      false,
    );
  });

  it.each(['slug', 'name', 'category'])('rejects a response without %s', (field) => {
    const incomplete = Object.fromEntries(
      Object.entries(swaggerExample).filter(([key]) => key !== field),
    );
    expect(businessDetailSchema.safeParse(incomplete).success).toBe(false);
  });

  // Los campos que sumen US-09, US-10 y US-17 no rompen la ficha antes de que la web los use.
  it('drops unknown fields without failing', () => {
    const withExtra = { ...swaggerExample, status: { state: 'open' } };
    expect(businessDetailSchema.parse(withExtra)).toEqual(swaggerExample);
  });
});
