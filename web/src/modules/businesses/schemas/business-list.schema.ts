import { z } from 'zod';

// Copia de la respuesta de GET /businesses (backend/src/modules/businesses/schemas/business.schema.ts).
// Si el backend cambia la forma, se cambia acá en el mismo PR: el http-client falla con
// INVALID_RESPONSE si no coinciden.
export const BUSINESS_STATES = ['open', 'closed', 'closed_today', 'paused'] as const;

export type BusinessState = (typeof BUSINESS_STATES)[number];

// El estado lo calcula la API (isOpenNow, HT-01): la web solo lo muestra.
export const businessStatusSchema = z.object({
  state: z.enum(BUSINESS_STATES),
  closesAt: z.iso.datetime().nullable(),
  nextOpeningAt: z.iso.datetime().nullable(),
});

export type BusinessStatus = z.infer<typeof businessStatusSchema>;

export const businessListItemSchema = z.object({
  slug: z.string(),
  name: z.string(),
  category: z.object({ slug: z.string(), name: z.string() }),
  // Hasta US-19 no hay fotos: viene siempre en null.
  photoUrl: z.url().nullable(),
  status: businessStatusSchema,
});

export type BusinessListItem = z.infer<typeof businessListItemSchema>;

// Lista paginada (D-25). El tope de limit es el MAX_PAGE_SIZE del backend.
export const businessListResponseSchema = z.object({
  data: z.array(businessListItemSchema),
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  total: z.number().int().min(0),
});

export type BusinessListResponse = z.infer<typeof businessListResponseSchema>;

// El parámetro ?pagina= de la URL (D-29). Cualquier valor que no sea un entero desde 1 vuelve a
// la primera página: es un enlace que alguien escribió o copió mal, no un error para mostrar.
// Si llega repetido (?pagina=2&pagina=3), Next lo entrega como lista y vale el primero.
export const listPageParamSchema = z
  .preprocess((value) => (Array.isArray(value) ? value[0] : value), z.coerce.number().int().min(1))
  .catch(1);
