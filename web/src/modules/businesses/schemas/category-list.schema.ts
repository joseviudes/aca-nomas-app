import { z } from 'zod';

// Copia de la respuesta de GET /categories (backend/src/modules/businesses/schemas/category.schema.ts).
// Si el backend cambia la forma, se cambia acá en el mismo PR: el http-client falla con
// INVALID_RESPONSE si no coinciden.
export const categorySchema = z.object({
  // El valor que se manda como ?category= a GET /businesses.
  slug: z.string(),
  // Lo que ve el visitante en las pestañas y en el desplegable.
  name: z.string(),
});

export type Category = z.infer<typeof categorySchema>;

// Lista paginada (D-25), ordenada por nombre. El tope de limit es el MAX_PAGE_SIZE del backend.
export const categoryListResponseSchema = z.object({
  data: z.array(categorySchema),
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  total: z.number().int().min(0),
});

export type CategoryListResponse = z.infer<typeof categoryListResponseSchema>;

// Mismo formato que valida la API para ?category= (minúsculas, números y guiones).
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// El parámetro ?rubro= de la URL (D-44, opción A). Igual que la API, se recorta y se pasa a
// minúsculas. Un valor mal formado cuenta como "Todo": es un enlace que alguien escribió o copió
// mal, no un error para mostrar, y así la API nunca recibe un rubro que respondería con un 400.
// Un rubro bien formado que no existe sí llega a la API, que devuelve la lista vacía.
// Si llega repetido (?rubro=a&rubro=b), Next lo entrega como lista y vale el primero.
export const listCategoryParamSchema = z
  .preprocess(
    (value) => (Array.isArray(value) ? value[0] : value),
    z.string().trim().toLowerCase().regex(SLUG_PATTERN).optional(),
  )
  .catch(undefined);
