import { describe, expect, it } from 'vitest';
import {
  FALLBACK_SLUG,
  toSlug,
  toUniqueSlug,
} from '../../../src/modules/businesses/domain/slug.js';

describe('toSlug', () => {
  // Los mismos nombres y slugs que carga el seed.
  it.each([
    ['Panadería La Espiga', 'panaderia-la-espiga'],
    ['Almacén Don Pedro', 'almacen-don-pedro'],
    ['Rotisería El Fogón', 'rotiseria-el-fogon'],
    ['Café del Puerto', 'cafe-del-puerto'],
  ])('convierte %o en %o', (name, slug) => {
    expect(toSlug(name)).toBe(slug);
  });

  it('cambia la ñ por n y saca la diéresis', () => {
    expect(toSlug('Ñandú Pingüino')).toBe('nandu-pinguino');
  });

  it('junta espacios repetidos y signos en un solo guion', () => {
    expect(toSlug('  Pizzas  &  Empanadas!! ')).toBe('pizzas-empanadas');
  });

  it('saca los apóstrofos sin cortar la palabra', () => {
    expect(toSlug("Lo de Pepe's")).toBe('lo-de-pepes');
  });

  it('conserva los números', () => {
    expect(toSlug('Kiosco 24 Horas')).toBe('kiosco-24-horas');
  });

  it('usa un slug por defecto si el nombre no tiene letras ni números', () => {
    expect(toSlug('¡¡!!')).toBe(FALLBACK_SLUG);
  });
});

describe('toUniqueSlug', () => {
  it('usa el slug del nombre si está libre', () => {
    expect(toUniqueSlug('Kiosco La Esquina', new Set(['almacen-don-pedro']))).toBe(
      'kiosco-la-esquina',
    );
  });

  it('suma -2 si el slug ya existe', () => {
    expect(toUniqueSlug('Kiosco La Esquina', new Set(['kiosco-la-esquina']))).toBe(
      'kiosco-la-esquina-2',
    );
  });

  it('busca el primer número libre', () => {
    const taken = new Set(['kiosco-la-esquina', 'kiosco-la-esquina-2', 'kiosco-la-esquina-3']);

    expect(toUniqueSlug('Kiosco La Esquina', taken)).toBe('kiosco-la-esquina-4');
  });

  it('trata igual dos nombres que solo difieren en tildes o mayúsculas', () => {
    expect(toUniqueSlug('CAFÉ DEL PUERTO', new Set(['cafe-del-puerto']))).toBe('cafe-del-puerto-2');
  });

  it('no pisa un negocio cuyo nombre ya termina en número', () => {
    // "Café 2" ocupa cafe-2, así que el segundo "Café" pasa a cafe-3.
    expect(toUniqueSlug('Café', new Set(['cafe', 'cafe-2']))).toBe('cafe-3');
  });

  it('también hace único el slug por defecto', () => {
    expect(toUniqueSlug('???', new Set([FALLBACK_SLUG]))).toBe(`${FALLBACK_SLUG}-2`);
  });
});
