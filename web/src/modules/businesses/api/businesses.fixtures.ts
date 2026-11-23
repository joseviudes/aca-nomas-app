import type { BusinessDetail, DaySchedule, Shift } from '../schemas/business-detail.schema';
import type { BusinessListItem, BusinessListResponse } from '../schemas/business-list.schema';
import type { CategoryListResponse } from '../schemas/category-list.schema';

// Datos de ejemplo con la forma del contrato (D-40). La web ya usa la API: quedan solo para las
// pruebas. Nombres inventados; los rubros son los del seed. En el listado, el estado es una muestra
// fija: paused o closed, sin horarios.
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

// GET /categories con ?limit=100: todos los rubros en una página, ordenados por nombre como la API.
export function categoryListFixture(): CategoryListResponse {
  const data = Object.entries(CATEGORIES)
    .map(([slug, name]) => ({ slug, name }))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'));
  return { data, page: 1, limit: 100, total: data.length };
}

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

// Igual que la API: una página fuera de rango o un rubro que no existe devuelven data vacía, no un
// error. Con rubro, total cuenta solo los negocios de ese rubro.
export function businessListFixture({
  page,
  limit,
  category,
}: {
  page: number;
  limit: number;
  category?: string;
}): BusinessListResponse {
  const items = category
    ? businessListItemsFixture.filter((business) => business.category.slug === category)
    : businessListItemsFixture;
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    page,
    limit,
    total: items.length,
  };
}

const TIME_ZONE = 'America/Argentina/Buenos_Aires';

// Arma los 7 días de lunes a domingo; el día que no aparece queda sin turnos (no abre).
function week(shiftsByDay: Partial<Record<DaySchedule['dayOfWeek'], Shift[]>>): DaySchedule[] {
  return [1, 2, 3, 4, 5, 6, 7].map((dayOfWeek) => ({
    dayOfWeek,
    shifts: shiftsByDay[dayOfWeek] ?? [],
  }));
}

const PANADERIA_WEEKDAY: Shift[] = [{ opensAt: '08:00', closesAt: '20:00' }];
const KIOSCO_NIGHT: Shift[] = [{ opensAt: '19:00', closesAt: '01:00' }];
const PELUQUERIA_SPLIT: Shift[] = [
  { opensAt: '09:00', closesAt: '13:00' },
  { opensAt: '16:00', closesAt: '20:00' },
];
const VERDULERIA_MORNING: Shift[] = [{ opensAt: '08:00', closesAt: '13:00' }];

// Fichas (GET /businesses/:slug), todas un martes a las 10:00 de Mantilla (13:00 UTC), como el
// ejemplo de Swagger. Cubren los casos de horario que la ficha muestra distinto:
// - la panadería es el ejemplo de Swagger: abierta, con un domingo sin turnos;
// - el kiosco, sin descripción y cerrado, tiene un turno que cruza la medianoche (19:00–01:00);
// - la peluquería marcó "hoy no abro" y tiene turno partido;
// - la verdulería está en pausa y conserva su horario.
const businessDetailsFixture: BusinessDetail[] = [
  {
    slug: 'panaderia-la-espiga',
    name: 'Panadería La Espiga',
    description: 'Pan casero, facturas y tortas por encargo.',
    category: { slug: 'panaderia', name: CATEGORIES.panaderia },
    photoUrl: null,
    status: { state: 'open', closesAt: '2026-11-17T23:00:00.000Z', nextOpeningAt: null },
    schedule: {
      timezone: TIME_ZONE,
      today: 2,
      days: week({
        1: PANADERIA_WEEKDAY,
        2: PANADERIA_WEEKDAY,
        3: PANADERIA_WEEKDAY,
        4: PANADERIA_WEEKDAY,
        5: PANADERIA_WEEKDAY,
        6: [{ opensAt: '09:00', closesAt: '13:00' }],
      }),
    },
  },
  {
    slug: 'kiosco-el-recreo',
    name: 'Kiosco El Recreo',
    description: null,
    category: { slug: 'kiosco', name: CATEGORIES.kiosco },
    photoUrl: null,
    status: { state: 'closed', closesAt: null, nextOpeningAt: '2026-11-17T22:00:00.000Z' },
    schedule: {
      timezone: TIME_ZONE,
      today: 2,
      days: week({
        1: KIOSCO_NIGHT,
        2: KIOSCO_NIGHT,
        3: KIOSCO_NIGHT,
        4: KIOSCO_NIGHT,
        5: KIOSCO_NIGHT,
        6: KIOSCO_NIGHT,
        7: KIOSCO_NIGHT,
      }),
    },
  },
  {
    slug: 'peluqueria-tijeras',
    name: 'Peluquería Tijeras',
    description: 'Cortes, color y peinados.',
    category: { slug: 'peluqueria', name: CATEGORIES.peluqueria },
    photoUrl: null,
    status: { state: 'closed_today', closesAt: null, nextOpeningAt: '2026-11-18T12:00:00.000Z' },
    schedule: {
      timezone: TIME_ZONE,
      today: 2,
      days: week({
        2: PELUQUERIA_SPLIT,
        3: PELUQUERIA_SPLIT,
        4: PELUQUERIA_SPLIT,
        5: PELUQUERIA_SPLIT,
        6: PELUQUERIA_SPLIT,
      }),
    },
  },
  {
    slug: 'verduleria-campo-fresco',
    name: 'Verdulería Campo Fresco',
    description: null,
    category: { slug: 'verduleria', name: CATEGORIES.verduleria },
    photoUrl: null,
    status: { state: 'paused', closesAt: null, nextOpeningAt: null },
    schedule: {
      timezone: TIME_ZONE,
      today: 2,
      days: week({
        1: VERDULERIA_MORNING,
        2: VERDULERIA_MORNING,
        3: VERDULERIA_MORNING,
        4: VERDULERIA_MORNING,
        5: VERDULERIA_MORNING,
        6: VERDULERIA_MORNING,
      }),
    },
  },
];

// undefined es un negocio que no existe: la API responde 404.
export function businessDetailFixture(slug: string): BusinessDetail | undefined {
  return businessDetailsFixture.find((business) => business.slug === slug);
}
