import express, { type Express } from 'express';
import { errorHandler } from './shared/middlewares/error-handler.js';
import { notFound } from './shared/middlewares/not-found.js';
import { requestLogger } from './shared/middlewares/request-logger.js';

export function createApp(): Express {
  const app = express();

  app.use(requestLogger);
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Siempre al final: primero el 404 y después el manejador de errores.
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
