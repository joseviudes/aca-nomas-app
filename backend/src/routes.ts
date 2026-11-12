import type { AuthController } from './modules/auth/controllers/auth.controller.js';
import { createAuthRouter } from './modules/auth/routes/auth.routes.js';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { createOpenApiDocument } from './openapi.js';


export interface ApiRouterOptions {
  // Swagger UI en /api/docs y la especificación en /api/openapi.json (D-34).
  apiDocs: boolean;
  // Los arma container.ts. Son opcionales para poder armar la app en pruebas que no usan la base.
  authController?: AuthController;
}
// Registro central de rutas (D-23): cada módulo suma su router acá y app.ts lo monta bajo /api.
export function createApiRouter({ apiDocs, authController }: ApiRouterOptions): Router {
  const router = Router();

   router.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  if (authController) {
    router.use('/auth', createAuthRouter(authController));
  }

  if (apiDocs) {
    // Se arma una sola vez al levantar el servidor, no en cada request.
    const document = createOpenApiDocument();
    router.get('/openapi.json', (_req, res) => {
      res.json(document);
    });
    router.use(
      '/docs',
      swaggerUi.serve,
      swaggerUi.setup(document, { customSiteTitle: 'AcáNomás API' }),
    );
  }

  return router;
}
