import express, { type Express } from 'express';
import { createApiRouter } from './routes.js';
import { errorHandler } from './shared/middlewares/error-handler.js';
import { notFound } from './shared/middlewares/not-found.js';
import { requestLogger } from './shared/middlewares/request-logger.js';

export function createApp(): Express {
  const app = express();

  app.use(requestLogger);
  app.use(express.json());

  app.use('/api', createApiRouter());

  // Siempre al final: primero el 404 y después el manejador de errores.
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
