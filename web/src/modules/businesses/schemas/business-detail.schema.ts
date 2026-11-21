import { z } from 'zod';

// Copia de la respuesta de GET /businesses/:slug (backend/src/modules/businesses/schemas/business.schema.ts).
// Si el backend cambia la forma, se cambia acá en el mismo PR: el http-client falla con
// INVALID_RESPONSE si no coinciden. Sin .strict(): los campos que sumen US-09, US-10 y US-17 se
// descartan hasta que la web los use, en lugar de romper la ficha.
export const businessDetailSchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string().max(80).nullable(),
  category: z.object({ slug: z.string(), name: z.string() }),
  // Hasta US-19 no hay fotos: viene siempre en null.
  photoUrl: z.url().nullable(),
});

export type BusinessDetail = z.infer<typeof businessDetailSchema>;
