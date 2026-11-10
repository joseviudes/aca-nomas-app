import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { container } from './container.js';
import { createBusinessesRouter } from './modules/businesses/routes/businesses.routes.js';
import { createOpenApiDocument } from './openapi.js';

export interface ApiRouterOptions {
  // Swagger UI en /api/docs y la especificación en /api/openapi.json (D-34).
  apiDocs: boolean;
}

// Registro central de rutas (D-23): cada módulo suma su router acá y app.ts lo monta bajo /api.
export function createApiRouter({ apiDocs }: ApiRouterOptions): Router {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  router.use('/businesses', createBusinessesRouter(container.businessController));

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
