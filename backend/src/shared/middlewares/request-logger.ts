import type { RequestHandler } from 'express';

// Logger mínimo sin dependencias. Si después hace falta formato JSON o niveles, se reemplaza por una librería.
export const requestLogger: RequestHandler = (req, res, next) => {
  const start = performance.now();

  res.on('finish', () => {
    const ms = Math.round(performance.now() - start);
    console.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });

  next();
};
