import { z } from 'zod';
import { MAX_PAGE_SIZE, paginationQuerySchema } from '../../../shared/pagination/pagination.js';

// Medios de pago permitidos (RF-18). La base guarda la lista en JSONB y no valida los valores (D-22).
export const PAYMENT_METHODS = ['cash', 'transfer', 'card', 'mercado_pago'] as const;

export const paymentMethodsSchema = z
  .array(z.enum(PAYMENT_METHODS))
  .refine((methods) => new Set(methods).size === methods.length, {
    message: 'Los medios de pago no se pueden repetir',
  });

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

// Estado actual del negocio (RN-01). Lo calcula isOpenNow (HT-01) y no se guarda en la base (D-22).
// Es la misma forma que devuelve isOpenNow, con los momentos en texto ISO en lugar de Date.
export const BUSINESS_STATES = ['open', 'closed', 'closed_today', 'paused'] as const;

export const businessStatusSchema = z
  .object({
    state: z.enum(BUSINESS_STATES).meta({
      description: 'open: abierto · closed: cerrado · closed_today: hoy no abre · paused: pausado',
    }),
    // Momentos exactos en UTC (D-11): la próxima apertura puede caer otro día.
    closesAt: z.iso.datetime().nullable().meta({
      description: 'Cuándo cierra. Solo con state open; en el resto, null',
    }),
    nextOpeningAt: z.iso.datetime().nullable().meta({
      description: 'Cuándo vuelve a abrir. Con state open, o si no tiene turnos cargados, null',
    }),
  })
  .meta({ id: 'BusinessStatus' });

export type BusinessStatus = z.infer<typeof businessStatusSchema>;

// Lo que muestra la tarjeta del listado (US-01): nombre, rubro, estado y foto. El slug arma el
// enlace a la ficha (US-08). Las coordenadas y la distancia se suman con US-06 y US-07.
export const businessListItemSchema = z
  .object({
    slug: z.string(),
    name: z.string(),
    category: z.object({ slug: z.string(), name: z.string() }),
    // La base guarda la clave de la foto y el adaptador de almacenamiento arma la URL (D-14).
    // Hasta US-19 no hay almacenamiento, así que viene siempre en null.
    photoUrl: z.url().nullable(),
    status: businessStatusSchema,
  })
  .meta({ id: 'BusinessListItem' });

export type BusinessListItem = z.infer<typeof businessListItemSchema>;

// Tope del texto de búsqueda, para que no llegue a la base una consulta enorme. A confirmar con US-02.
export const MAX_SEARCH_LENGTH = 100;

// Mismo formato que los slugs del seed: minúsculas, números y guiones (panaderia, mercado-central).
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Un parámetro vacío o con solo espacios cuenta como ausente: el formulario de la web puede mandar
// ?q= o ?category= al borrar el campo, y z.coerce convertiría ?lat= en 0, un punto válido del mapa.
function optionalParam<T extends z.ZodType>(schema: T) {
  return z.preprocess((value) => {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
  }, schema.optional());
}

// Filtros del listado, ya validados y normalizados. Todavía no entran en la ruta: el repositorio no
// filtra, y publicarlos haría que ?category=panaderia devuelva todos los negocios sin avisar. Cada
// historia suma su campo a businessListQuerySchema cuando lo aplica, por ejemplo
// paginationQuerySchema.extend({ q: businessListFiltersSchema.shape.q }), y la regla de lat y lng
// se suma con US-06.
export const businessListFiltersSchema = z
  .object({
    // US-02: busca en nombre y descripción. Las mayúsculas y las tildes las resuelve el repositorio.
    q: optionalParam(z.string().max(MAX_SEARCH_LENGTH)),
    // US-03: slug del rubro. Un rubro que no existe devuelve una lista vacía, no un error.
    category: optionalParam(
      z.string().toLowerCase().regex(SLUG_PATTERN, {
        message: 'Tiene que ser el slug de un rubro, por ejemplo panaderia',
      }),
    ),
    // US-04: solo "true" o "false". z.coerce.boolean convertiría "false" en true.
    openNow: optionalParam(
      z.stringbool({ truthy: ['true'], falsy: ['false'], error: 'Tiene que ser true o false' }),
    ),
    // US-06: ubicación del visitante, para la distancia y el orden por cercanía (US-05).
    lat: optionalParam(z.coerce.number().min(-90).max(90)),
    lng: optionalParam(z.coerce.number().min(-180).max(180)),
  })
  // Como en la base (D-22): una coordenada sola no sirve para calcular la distancia.
  .superRefine(({ lat, lng }, ctx) => {
    if ((lat === undefined) === (lng === undefined)) return;
    ctx.addIssue({
      code: 'custom',
      path: [lat === undefined ? 'lat' : 'lng'],
      message: 'lat y lng van juntas',
    });
  });

export type BusinessListFilters = z.infer<typeof businessListFiltersSchema>;

// Consulta del listado: page y limit (US-01), con 20 por página por defecto, y los filtros de
// businessListFiltersSchema que ya aplica el repositorio. Hoy, category (US-03); q, openNow, lat y
// lng se suman con US-02, US-04 y US-06, cuando el repositorio los filtre.
export const businessListQuerySchema = paginationQuerySchema.extend({
  category: businessListFiltersSchema.shape.category,
});

export type BusinessListQuery = z.infer<typeof businessListQuerySchema>;

// Lista paginada (D-25): { data, page, limit, total }.
export const businessListResponseSchema = z
  .object({
    data: z.array(businessListItemSchema),
    page: z.number().int().min(1),
    limit: z.number().int().min(1).max(MAX_PAGE_SIZE),
    total: z.number().int().min(0).meta({ description: 'Negocios que cumplen los filtros' }),
  })
  .meta({
    id: 'BusinessListResponse',
    // Lo que devuelve ?page=3&limit=2 con el seed un martes a las 10:00 de Mantilla (13:00 UTC):
    // la ferretería está en pausa y el kiosco, abierto hasta las 23:30 (02:30 UTC del miércoles).
    example: {
      data: [
        {
          slug: 'ferreteria-el-tornillo',
          name: 'Ferretería El Tornillo',
          category: { slug: 'ferreteria', name: 'Ferretería' },
          photoUrl: null,
          status: { state: 'paused', closesAt: null, nextOpeningAt: null },
        },
        {
          slug: 'kiosco-la-esquina',
          name: 'Kiosco La Esquina',
          category: { slug: 'kiosco', name: 'Kiosco' },
          photoUrl: null,
          status: { state: 'open', closesAt: '2026-11-18T02:30:00.000Z', nextOpeningAt: null },
        },
      ],
      page: 3,
      limit: 2,
      total: 10,
    },
  });

export type BusinessListResponse = z.infer<typeof businessListResponseSchema>;

// Parámetro de GET /api/businesses/:slug (US-08). El slug identifica al negocio y nunca cambia (RN-05).
// No se valida el formato: un slug mal escrito es un negocio que no existe, y la web muestra su
// página 404 (RF-08). Con un 400 tendría que tratar dos respuestas distintas para el mismo caso.
export const businessSlugParamsSchema = z.object({
  slug: z.string(),
});

export type BusinessSlugParams = z.infer<typeof businessSlugParamsSchema>;

// Ficha pública de un negocio (US-08). Un recurso va sin envoltorio (D-25). El estado, el horario
// semanal (US-09), los canales visibles (US-10 y US-16) y los medios de pago y entregas (US-17) se
// suman con sus historias, cuando el backend los resuelva.
export const businessDetailSchema = z
  .object({
    slug: z.string(),
    name: z.string(),
    description: z.string().max(80).nullable().meta({ description: 'Hasta 80 caracteres (RF-16)' }),
    category: z.object({ slug: z.string(), name: z.string() }),
    // Como en el listado: hasta US-19 no hay almacenamiento, así que viene siempre en null (D-14).
    photoUrl: z.url().nullable(),
  })
  .meta({
    id: 'BusinessDetail',
    // Lo que devuelve /businesses/panaderia-la-espiga con el seed.
    example: {
      slug: 'panaderia-la-espiga',
      name: 'Panadería La Espiga',
      description: 'Pan casero, facturas y tortas por encargo.',
      category: { slug: 'panaderia', name: 'Panadería' },
      photoUrl: null,
    },
  });

export type BusinessDetail = z.infer<typeof businessDetailSchema>;
