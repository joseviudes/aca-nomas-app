import type { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/app-error.js';

function isInvalidJson(err: unknown): boolean {
  return err instanceof SyntaxError && 'type' in err && err.type === 'entity.parse.failed';
}

// Único lugar que arma respuestas de error. Express 5 trae acá también los errores de funciones async.
// Los cuatro parámetros son obligatorios: así Express lo reconoce como manejador de errores.
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: { code: err.code, message: err.message, details: err.details },
    });
    return;
  }

  if (isInvalidJson(err)) {
    res.status(400).json({
      error: { code: 'INVALID_JSON', message: 'El cuerpo no es un JSON válido', details: [] },
    });
    return;
  }

  // Un error inesperado se registra completo, pero al cliente no se le muestra el detalle.
  console.error(err);
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor', details: [] },
  });
};
