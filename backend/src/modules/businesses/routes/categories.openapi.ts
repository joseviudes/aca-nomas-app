import type { ZodOpenApiPathsObject } from 'zod-openapi';
import { errorResponse } from '../../../shared/openapi/common.schemas.js';
import { categoryListQuerySchema, categoryListResponseSchema } from '../schemas/category.schema.js';

// Documentación de los rubros (D-34), con los mismos esquemas Zod que validan la ruta.
// Se registra en src/openapi.ts. Las rutas van sin /api.
export const categoriesPaths: ZodOpenApiPathsObject = {
  '/categories': {
    get: {
      tags: ['Negocios'],
      summary: 'Lista los rubros para el filtro del listado',
      description:
        'Público, sin sesión (US-03). Es una lista fija cargada con el seed, ordenada por nombre. ' +
        'El slug de cada rubro es el valor del parámetro category de GET /api/businesses.',
      requestParams: { query: categoryListQuerySchema },
      responses: {
        '200': {
          description: 'Una página de rubros',
          content: { 'application/json': { schema: categoryListResponseSchema } },
        },
        '400': errorResponse('page o limit no son válidos (VALIDATION_ERROR)', {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Los datos enviados no son válidos',
            details: [
              {
                path: 'query.limit',
                message: 'Demasiado grande: se esperaba que número fuera <=100',
              },
            ],
          },
        }),
      },
    },
  },
};
