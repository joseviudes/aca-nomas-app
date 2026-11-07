import { z } from 'zod';
import { createDocument, type ZodOpenApiPathsObject } from 'zod-openapi';
import { errorResponseSchema } from './shared/openapi/common.schemas.js';

// Registro central de la documentación (D-34), igual que routes.ts para las rutas (D-23).
// Cada módulo exporta sus paths desde routes/<módulo>.openapi.ts y se suman acá.
// Las rutas van sin /api: el prefijo está en `servers`, como en app.ts.

const healthPaths: ZodOpenApiPathsObject = {
  '/health': {
    get: {
      tags: ['Salud'],
      summary: 'Comprueba que la API está levantada',
      responses: {
        '200': {
          description: 'La API responde',
          content: {
            'application/json': { schema: z.object({ status: z.literal('ok') }) },
          },
        },
      },
    },
  },
};

export function createOpenApiDocument() {
  return createDocument({
    openapi: '3.1.0',
    info: {
      title: 'AcáNomás API',
      version: '0.1.0',
      description:
        'API del directorio de negocios locales. Las reglas comunes (paginación, errores, fechas) están en docs/api.md.',
    },
    servers: [{ url: '/api' }],
    paths: {
      ...healthPaths,
    },
    // Se registra siempre, aunque todavía ningún endpoint devuelva errores documentados.
    components: { schemas: { ErrorResponse: errorResponseSchema } },
  });
}
