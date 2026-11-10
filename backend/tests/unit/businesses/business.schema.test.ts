import { describe, expect, it } from 'vitest';
import {
  businessListResponseSchema,
  paymentMethodsSchema,
  type BusinessListItem,
} from '../../../src/modules/businesses/schemas/business.schema.js';

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
