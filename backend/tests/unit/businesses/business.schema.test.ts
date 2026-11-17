import { describe, expect, it } from 'vitest';
import {
  businessListFiltersSchema,
  businessListQuerySchema,
  businessListResponseSchema,
  MAX_SEARCH_LENGTH,
  paymentMethodsSchema,
  type BusinessListItem,
} from '../../../src/modules/businesses/schemas/business.schema.js';

describe('businessListQuerySchema', () => {
  it('pide la primera página de 20 negocios si no se indica nada', () => {
    expect(businessListQuerySchema.parse({})).toEqual({ page: 1, limit: 20 });
  });

  it('convierte page y limit de texto a número', () => {
    expect(businessListQuerySchema.parse({ page: '2', limit: '50' })).toEqual({
      page: 2,
      limit: 50,
    });
  });

  it.each([{ page: '0' }, { page: 'dos' }, { limit: '101' }])('rechaza %o', (query) => {
    expect(businessListQuerySchema.safeParse(query).success).toBe(false);
  });

  it('todavía no acepta filtros: los descarta hasta que el repositorio los aplique', () => {
    expect(businessListQuerySchema.parse({ category: 'panaderia', openNow: 'true' })).toEqual({
      page: 1,
      limit: 20,
    });
  });
});

describe('businessListFiltersSchema', () => {
  const issuePaths = (query: unknown) =>
    businessListFiltersSchema.safeParse(query).error?.issues.map((issue) => issue.path.join('.'));

  it('sin filtros no filtra nada', () => {
    expect(businessListFiltersSchema.parse({})).toEqual({});
  });

  it('normaliza todos los filtros juntos', () => {
    expect(
      businessListFiltersSchema.parse({
        q: '  pan casero ',
        category: 'Panaderia',
        openNow: 'true',
        lat: '-27.4512',
        lng: '-58.9867',
      }),
    ).toEqual({
      q: 'pan casero',
      category: 'panaderia',
      openNow: true,
      lat: -27.4512,
      lng: -58.9867,
    });
  });

  it.each([{ q: '' }, { q: '   ' }, { category: '' }, { openNow: '' }, { lat: '', lng: '' }])(
    'toma %o como un filtro ausente',
    (query) => {
      expect(businessListFiltersSchema.parse(query)).toEqual({});
    },
  );

  describe('q', () => {
    it(`acepta hasta ${MAX_SEARCH_LENGTH} caracteres sin contar los espacios de los bordes`, () => {
      const q = 'a'.repeat(MAX_SEARCH_LENGTH);

      expect(businessListFiltersSchema.parse({ q: ` ${q} ` })).toEqual({ q });
    });

    it('rechaza un texto más largo', () => {
      expect(issuePaths({ q: 'a'.repeat(MAX_SEARCH_LENGTH + 1) })).toEqual(['q']);
    });

    it('rechaza el parámetro repetido', () => {
      expect(issuePaths({ q: ['pan', 'leche'] })).toEqual(['q']);
    });
  });

  describe('category', () => {
    it.each(['panaderia', 'mercado-central', 'kiosco-24'])('acepta el slug %s', (category) => {
      expect(businessListFiltersSchema.parse({ category })).toEqual({ category });
    });

    it.each(['Panadería', 'mercado central', '-kiosco', 'kiosco--24', 'ferretería'])(
      'rechaza %s',
      (category) => {
        expect(issuePaths({ category })).toEqual(['category']);
      },
    );
  });

  describe('openNow', () => {
    it('convierte "false" en false, no en true', () => {
      expect(businessListFiltersSchema.parse({ openNow: 'false' })).toEqual({ openNow: false });
    });

    it('no distingue mayúsculas', () => {
      expect(businessListFiltersSchema.parse({ openNow: 'TRUE' })).toEqual({ openNow: true });
    });

    it.each(['1', 'si', 'abierto'])('rechaza %s', (openNow) => {
      expect(issuePaths({ openNow })).toEqual(['openNow']);
    });
  });

  describe('lat y lng', () => {
    it('acepta los extremos del mapa', () => {
      expect(businessListFiltersSchema.parse({ lat: '-90', lng: '180' })).toEqual({
        lat: -90,
        lng: 180,
      });
    });

    it('acepta 0, 0 como un punto válido', () => {
      expect(businessListFiltersSchema.parse({ lat: '0', lng: '0' })).toEqual({ lat: 0, lng: 0 });
    });

    it.each([
      [{ lat: '90.1', lng: '0' }, 'lat'],
      [{ lat: '0', lng: '-180.1' }, 'lng'],
      [{ lat: 'norte', lng: '0' }, 'lat'],
    ])('rechaza %o en %s', (query, path) => {
      expect(issuePaths(query)).toEqual([path]);
    });

    it.each([
      [{ lat: '-27.45' }, 'lng'],
      [{ lng: '-58.98' }, 'lat'],
      [{ lat: '-27.45', lng: '' }, 'lng'],
    ])('rechaza %o y marca la que falta (%s)', (query, path) => {
      expect(issuePaths(query)).toEqual([path]);
    });
  });
});

const openBusiness: BusinessListItem = {
  slug: 'panaderia-la-espiga',
  name: 'Panadería La Espiga',
  category: { slug: 'panaderia', name: 'Panadería' },
  photoUrl: null,
  status: { state: 'open', closesAt: '2026-11-10T23:00:00.000Z', nextOpeningAt: null },
};

const listOf = (...data: unknown[]) => ({ data, page: 1, limit: 20, total: data.length });

describe('businessListResponseSchema', () => {
  it('acepta una página del listado', () => {
    expect(businessListResponseSchema.parse(listOf(openBusiness))).toEqual(listOf(openBusiness));
  });

  it('acepta una página vacía', () => {
    expect(businessListResponseSchema.safeParse(listOf()).success).toBe(true);
  });

  it.each(['open', 'closed', 'closed_today', 'paused'])('acepta el estado %s', (state) => {
    const business = { ...openBusiness, status: { state, closesAt: null, nextOpeningAt: null } };

    expect(businessListResponseSchema.safeParse(listOf(business)).success).toBe(true);
  });

  it('rechaza un estado que no existe', () => {
    const business = { ...openBusiness, status: { ...openBusiness.status, state: 'abierto' } };

    expect(businessListResponseSchema.safeParse(listOf(business)).success).toBe(false);
  });

  it('rechaza una hora de cierre que no es ISO 8601', () => {
    const business = { ...openBusiness, status: { ...openBusiness.status, closesAt: '19:00' } };

    expect(businessListResponseSchema.safeParse(listOf(business)).success).toBe(false);
  });

  it('acepta una foto con URL y rechaza una que no lo es', () => {
    const withPhoto = { ...openBusiness, photoUrl: 'http://localhost:3000/uploads/la-espiga.webp' };
    const withKey = { ...openBusiness, photoUrl: 'businesses/la-espiga.webp' };

    expect(businessListResponseSchema.safeParse(listOf(withPhoto)).success).toBe(true);
    expect(businessListResponseSchema.safeParse(listOf(withKey)).success).toBe(false);
  });

  it('rechaza un negocio sin rubro', () => {
    const withoutCategory = { ...openBusiness, category: undefined };

    expect(businessListResponseSchema.safeParse(listOf(withoutCategory)).success).toBe(false);
  });

  it('rechaza una página sin total', () => {
    const withoutTotal = { ...listOf(openBusiness), total: undefined };

    expect(businessListResponseSchema.safeParse(withoutTotal).success).toBe(false);
  });

  // Si el esquema cambia (por ejemplo, con HT-01), el ejemplo de Swagger no puede quedar viejo.
  it('el ejemplo que muestra Swagger cumple el esquema', () => {
    const example: unknown = businessListResponseSchema.meta()?.example;

    expect(businessListResponseSchema.safeParse(example).success).toBe(true);
  });
});

describe('paymentMethodsSchema', () => {
  it('acepta una lista de medios de pago permitidos', () => {
    expect(paymentMethodsSchema.parse(['cash', 'mercado_pago'])).toEqual(['cash', 'mercado_pago']);
  });

  it('acepta una lista vacía', () => {
    expect(paymentMethodsSchema.parse([])).toEqual([]);
  });

  it('rechaza un medio de pago que no está en la lista', () => {
    expect(paymentMethodsSchema.safeParse(['cash', 'bitcoin']).success).toBe(false);
  });

  it('rechaza medios de pago repetidos', () => {
    expect(paymentMethodsSchema.safeParse(['cash', 'cash']).success).toBe(false);
  });

  it('rechaza un valor que no es una lista', () => {
    expect(paymentMethodsSchema.safeParse({ cash: true }).success).toBe(false);
  });
});
