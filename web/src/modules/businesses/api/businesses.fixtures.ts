import type { BusinessDetail } from '../schemas/business-detail.schema';
import type { BusinessListItem, BusinessListResponse } from '../schemas/business-list.schema';

// Datos de ejemplo con la forma del contrato (D-40). La web ya usa la API: quedan solo para las
// pruebas. Nombres inventados; los rubros son los del seed. El estado es una muestra fija: paused
// o closed, sin horarios.
const CATEGORIES = {
  panaderia: 'Panadería',
  almacen: 'Almacén',
  farmacia: 'Farmacia',
  rotiseria: 'Rotisería',
  kiosco: 'Kiosco',
  ferreteria: 'Ferretería',
  verduleria: 'Verdulería',
  peluqueria: 'Peluquería',
  cafeteria: 'Cafetería',
  bicicleteria: 'Bicicletería',
} as const;

type CategorySlug = keyof typeof CATEGORIES;

const BUSINESSES: Array<[slug: string, name: string, category: CategorySlug, paused?: true]> = [
  ['almacen-el-colibri', 'Almacén El Colibrí', 'almacen'],
  ['almacen-dona-rosa', 'Almacén Doña Rosa', 'almacen', true],
  ['bicicleteria-pedal-norte', 'Bicicletería Pedal Norte', 'bicicleteria'],
  ['cafe-la-galeria', 'Café La Galería', 'cafeteria'],
  ['cafeteria-el-molino', 'Cafetería El Molino', 'cafeteria'],
  ['farmacia-san-jose', 'Farmacia San José', 'farmacia'],
  ['farmacia-plaza', 'Farmacia Plaza', 'farmacia'],
  ['ferreteria-la-llave', 'Ferretería La Llave', 'ferreteria', true],
  ['ferreteria-tuerca-y-clavo', 'Ferretería Tuerca y Clavo', 'ferreteria'],
  ['kiosco-el-recreo', 'Kiosco El Recreo', 'kiosco'],
  ['kiosco-24', 'Kiosco 24', 'kiosco'],
  ['kiosco-la-parada', 'Kiosco La Parada', 'kiosco', true],
  ['panaderia-el-horno', 'Panadería El Horno', 'panaderia'],
  ['panaderia-trigo-dorado', 'Panadería Trigo Dorado', 'panaderia'],
  ['panaderia-la-medialuna', 'Panadería La Medialuna', 'panaderia'],
  ['peluqueria-tijeras', 'Peluquería Tijeras', 'peluqueria'],
  ['peluqueria-nuevo-look', 'Peluquería Nuevo Look', 'peluqueria', true],
  ['rotiseria-la-brasa', 'Rotisería La Brasa', 'rotiseria'],
  ['rotiseria-sabores', 'Rotisería Sabores', 'rotiseria'],
  ['rotiseria-el-patio', 'Rotisería El Patio', 'rotiseria'],
  ['verduleria-la-huerta', 'Verdulería La Huerta', 'verduleria'],
  ['verduleria-el-limonero', 'Verdulería El Limonero', 'verduleria'],
  ['verduleria-campo-fresco', 'Verdulería Campo Fresco', 'verduleria', true],
  ['almacen-la-esquinita', 'Almacén La Esquinita', 'almacen'],
  ['cafe-de-la-estacion', 'Café de la Estación', 'cafeteria'],
];

const businessListItemsFixture: BusinessListItem[] = BUSINESSES.map(
  ([slug, name, category, paused]) => ({
    slug,
    name,
    category: { slug: category, name: CATEGORIES[category] },
    photoUrl: null,
    status: { state: paused ? 'paused' : 'closed', closesAt: null, nextOpeningAt: null },
  }),
);

// Igual que la API: una página fuera de rango devuelve data vacía, no un error.
export function businessListFixture({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): BusinessListResponse {
  const start = (page - 1) * limit;
  return {
    data: businessListItemsFixture.slice(start, start + limit),
    page,
    limit,
    total: businessListItemsFixture.length,
  };
}

// Fichas (GET /businesses/:slug). La primera es el ejemplo de Swagger; la segunda, un negocio sin
// descripción.
const businessDetailsFixture: BusinessDetail[] = [
  {
    slug: 'panaderia-la-espiga',
    name: 'Panadería La Espiga',
    description: 'Pan casero, facturas y tortas por encargo.',
    category: { slug: 'panaderia', name: CATEGORIES.panaderia },
    photoUrl: null,
  },
  {
    slug: 'kiosco-el-recreo',
    name: 'Kiosco El Recreo',
    description: null,
    category: { slug: 'kiosco', name: CATEGORIES.kiosco },
    photoUrl: null,
  },
];

// undefined es un negocio que no existe: la API responde 404.
export function businessDetailFixture(slug: string): BusinessDetail | undefined {
  return businessDetailsFixture.find((business) => business.slug === slug);
}
