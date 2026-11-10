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
// PROVISORIO: la forma se confirma con quien hace HT-01. Hasta entonces el listado devuelve un
// estado de ejemplo, para que la web pueda armar la etiqueta de cada tarjeta.
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

// Consulta del listado (US-01): page y limit, con 20 por página por defecto. Los filtros (q,
// category, openNow, lat y lng) se suman con US-02 a US-06 extendiendo este esquema.
export const businessListQuerySchema = paginationQuerySchema;

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
    example: {
      data: [
        {
          slug: 'panaderia-la-espiga',
          name: 'Panadería La Espiga',
          category: { slug: 'panaderia', name: 'Panadería' },
          photoUrl: null,
          status: { state: 'open', closesAt: '2026-11-10T23:00:00.000Z', nextOpeningAt: null },
        },
        {
          slug: 'ferreteria-el-tornillo',
          name: 'Ferretería El Tornillo',
          category: { slug: 'ferreteria', name: 'Ferretería' },
          photoUrl: null,
          status: { state: 'paused', closesAt: null, nextOpeningAt: null },
        },
      ],
      page: 1,
      limit: 20,
      total: 10,
    },
  });

export type BusinessListResponse = z.infer<typeof businessListResponseSchema>;
