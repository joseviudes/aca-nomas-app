import { describe, expect, it } from 'vitest';
import {
  businessCountLabel,
  businessDetailPath,
  businessInitial,
  businessShareTexts,
} from '@/modules/businesses/domain/business-display';

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

describe('businessDetailPath', () => {
  it('builds the Spanish URL of the listing', () => {
    expect(businessDetailPath('panaderia-la-espiga')).toBe('/negocios/panaderia-la-espiga');
  });

  it('encodes characters that would change the route', () => {
    expect(businessDetailPath('a/b?c')).toBe('/negocios/a%2Fb%3Fc');
  });
});

describe('businessShareTexts', () => {
  it('adds the brand to the title and keeps the description', () => {
    expect(businessShareTexts({ name: 'Panadería La Espiga', description: 'Pan casero.' })).toEqual(
      { title: 'Panadería La Espiga | AcáNomás', description: 'Pan casero.' },
    );
  });

  it('leaves the description empty when the business has none', () => {
    expect(businessShareTexts({ name: 'Kiosco El Recreo', description: null })).toEqual({
      title: 'Kiosco El Recreo | AcáNomás',
      description: undefined,
    });
  });
});
