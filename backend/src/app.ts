import express, { type Express } from 'express';
import { env } from './config/env.js';
import { createApiRouter } from './routes.js';
import { createCors } from './shared/middlewares/cors.js';
import { errorHandler } from './shared/middlewares/error-handler.js';
import { notFound } from './shared/middlewares/not-found.js';
import { requestLogger } from './shared/middlewares/request-logger.js';

export interface AppOptions {
  // Swagger UI y /api/openapi.json. Por defecto, en todos los entornos menos producción (D-34).
  apiDocs?: boolean;
}

export function createApp({ apiDocs = env.NODE_ENV !== 'production' }: AppOptions = {}): Express {
  const app = express();

  app.use(requestLogger);
  // Antes de las rutas: responde las preflight (OPTIONS) sin que lleguen al 404.
  app.use(createCors(env.CORS_ORIGINS));
  app.use(express.json());

  app.use('/api', createApiRouter({ apiDocs }));

  // Siempre al final: primero el 404 y después el manejador de errores.
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
