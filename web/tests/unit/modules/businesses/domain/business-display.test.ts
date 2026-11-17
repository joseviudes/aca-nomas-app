import { describe, expect, it } from 'vitest';
import { businessCountLabel, businessInitial } from '@/modules/businesses/domain/business-display';

describe('businessInitial', () => {
  it.each([
    ['Panadería La Espiga', 'P'],
    ['  almacén Don Tito', 'A'],
    ['ñandú', 'Ñ'],
    ['', ''],
    ['   ', ''],
  ])('takes the initial of "%s" as "%s"', (name, initial) => {
    expect(businessInitial(name)).toBe(initial);
  });
});

describe('businessCountLabel', () => {
  it.each([
    [0, '0 negocios'],
    [1, '1 negocio'],
    [20, '20 negocios'],
  ])('labels %i as "%s"', (total, label) => {
    expect(businessCountLabel(total)).toBe(label);
  });
});
