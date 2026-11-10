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
        'Público, sin sesión (US-01). Trae 20 negocios por página por defecto y 100 como máximo.',
      requestParams: { query: businessListQuerySchema },
      responses: {
        '200': {
          description: 'Una página del listado',
          content: { 'application/json': { schema: businessListResponseSchema } },
        },
        '400': errorResponse('page o limit no son válidos (VALIDATION_ERROR)'),
      },
    },
  },
};
