import { describe, expect, it } from 'vitest';
import { paymentMethodsSchema } from '../../../src/modules/businesses/schemas/business.schema.js';

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
