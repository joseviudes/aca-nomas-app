import type { ZodOpenApiPathsObject } from 'zod-openapi';
import { errorResponse } from '../../../shared/openapi/common.schemas.js';
import { businessListQuerySchema, businessListResponseSchema } from '../schemas/business.schema.js';

// Documentación del módulo (D-34), con los mismos esquemas Zod que validan la ruta.
// Se registra en src/openapi.ts. Las rutas van sin /api.
export const businessesPaths: ZodOpenApiPathsObject = {
  '/businesses': {
    get: {
      tags: ['Negocios'],
      summary: 'Lista los negocios de la localidad, paginados',
      description:
        'Público, sin sesión (US-01). Trae 20 negocios por página por defecto y 100 como máximo. ' +
        'Una página fuera de rango devuelve data vacía, no un error. Hasta HT-01, status.state ' +
        'es paused si el negocio está en pausa y closed en el resto.',
      requestParams: { query: businessListQuerySchema },
      responses: {
        '200': {
          description: 'Una página del listado',
          content: { 'application/json': { schema: businessListResponseSchema } },
        },
        // La respuesta real de ?limit=500. El message de details lo arma Zod y hoy sale en inglés.
        '400': errorResponse('page o limit no son válidos (VALIDATION_ERROR)', {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Los datos enviados no son válidos',
            details: [{ path: 'query.limit', message: 'Too big: expected number to be <=100' }],
          },
        }),
      },
    },
  },
};
