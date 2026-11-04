import type { RequestHandler } from 'express';
import { NotFoundError } from '../errors/http-errors.js';

// Va después de todas las rutas: si ninguna respondió, la ruta no existe.
export const notFound: RequestHandler = (req, _res, next) => {
  next(new NotFoundError(`No existe la ruta ${req.method} ${req.path}`, 'ROUTE_NOT_FOUND'));
};
