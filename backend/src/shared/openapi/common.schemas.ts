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

// Respuesta de error lista para usar en `responses` de cada endpoint.
export function errorResponse(description: string): ZodOpenApiResponseObject {
  return {
    description,
    content: { 'application/json': { schema: errorResponseSchema } },
  };
}
