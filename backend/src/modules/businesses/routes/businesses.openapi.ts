import type { ZodOpenApiPathsObject } from 'zod-openapi';
import { errorResponse } from '../../../shared/openapi/common.schemas.js';
import {
  businessDetailSchema,
  businessListQuerySchema,
  businessListResponseSchema,
  businessSlugParamsSchema,
} from '../schemas/business.schema.js';

// Documentación del módulo (D-34), con los mismos esquemas Zod que validan la ruta.
// Se registra en src/openapi.ts. Las rutas van sin /api.
export const businessesPaths: ZodOpenApiPathsObject = {
  '/businesses': {
    get: {
      tags: ['Negocios'],
      summary: 'Lista los negocios de la localidad, paginados',
      description:
        'Público, sin sesión (US-01). Trae 20 negocios por página por defecto y 100 como máximo. ' +
        'Una página fuera de rango devuelve data vacía, no un error. status es el estado en el ' +
        'momento de la consulta, en la zona horaria de la localidad: en pausa, "hoy no abro" y ' +
        'después el horario semanal, en ese orden (RN-01).',
      requestParams: { query: businessListQuerySchema },
      responses: {
        '200': {
          description: 'Una página del listado',
          content: { 'application/json': { schema: businessListResponseSchema } },
        },
        // La respuesta real de ?limit=500. El message de details sale del locale de Zod (config/zod.ts).
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
  '/businesses/{slug}': {
    get: {
      tags: ['Negocios'],
      summary: 'Devuelve la ficha pública de un negocio',
      description:
        'Público, sin sesión (US-08). La web la muestra en /negocios/[slug] (D-29). Si el negocio ' +
        'no existe, responde 404 y la web muestra su página 404 (RF-08). Un slug mal escrito ' +
        '(con mayúsculas o tildes) también da 404: ningún negocio lo tiene.',
      requestParams: { path: businessSlugParamsSchema },
      responses: {
        '200': {
          description: 'La ficha del negocio',
          content: { 'application/json': { schema: businessDetailSchema } },
        },
        '404': errorResponse('No existe un negocio con ese slug (BUSINESS_NOT_FOUND)', {
          error: {
            code: 'BUSINESS_NOT_FOUND',
            message: 'No se encontró el negocio',
            details: [],
          },
        }),
      },
    },
  },
};
