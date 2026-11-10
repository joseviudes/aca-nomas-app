import { z } from 'zod';
import type { ZodOpenApiResponseObject } from 'zod-openapi';

// Formato estándar de error de la API (D-11), para la documentación. El `id` lo registra una sola
// vez en components.schemas y cada respuesta de error lo referencia.
export const errorResponseSchema = z
  .object({
    error: z.object({
      code: z.string().meta({ example: 'VALIDATION_ERROR' }),
      message: z.string().meta({ example: 'Los datos enviados no son válidos' }),
      details: z.array(z.unknown()),
    }),
  })
  .meta({ id: 'ErrorResponse', description: 'Formato de todas las respuestas de error' });

export type ErrorResponseExample = z.infer<typeof errorResponseSchema>;

// Respuesta de error lista para usar en `responses` de cada endpoint. El ejemplo es opcional y va
// en la respuesta, no en el esquema: ErrorResponse es uno solo y cada endpoint tiene su propio caso.
export function errorResponse(
  description: string,
  example?: ErrorResponseExample,
): ZodOpenApiResponseObject {
  return {
    description,
    content: { 'application/json': { schema: errorResponseSchema, example } },
  };
}
