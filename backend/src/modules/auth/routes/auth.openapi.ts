import type { ZodOpenApiPathsObject } from 'zod-openapi';
import { errorResponseSchema } from '../../../shared/openapi/common.schemas.js';
import { registerBodySchema, registerResponseSchema } from '../schemas/auth.schema.js';

export const authPaths: ZodOpenApiPathsObject = {
  '/auth/register': {
    post: {
      tags: ['Autenticación'],
      summary: 'Crea la cuenta de un dueño',
      requestBody: {
        content: { 'application/json': { schema: registerBodySchema } },
      },
      responses: {
        '201': {
          description: 'Cuenta creada',
          content: { 'application/json': { schema: registerResponseSchema } },
        },
        '409': {
          description: 'EMAIL_TAKEN: ya existe una cuenta con ese email',
          content: {
            'application/json': {
              schema: errorResponseSchema,
              example: {
                error: {
                  code: 'EMAIL_TAKEN',
                  message: 'Ya existe una cuenta con ese email',
                  details: [],
                },
              },
            },
          },
        },
      },
    },
  },
};