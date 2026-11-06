import { z } from 'zod';

// Formato de error de la API: { error: { code, message, details } } (docs/api.md).
const apiErrorBodySchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.array(z.unknown()).default([]),
  }),
});

// Error que lanza el http-client. Las pantallas deciden qué mostrar según `code`, nunca según el texto.
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: unknown[];

  constructor(status: number, code: string, message: string, details: unknown[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static fromResponse(status: number, body: unknown): ApiError {
    const parsed = apiErrorBodySchema.safeParse(body);
    if (!parsed.success) {
      return new ApiError(status, 'UNKNOWN_ERROR', 'Ocurrió un error inesperado');
    }
    const { code, message, details } = parsed.data.error;
    return new ApiError(status, code, message, details);
  }

  // `fetch` falla así cuando no hay conexión o la API está apagada: no llega ninguna respuesta.
  static network(): ApiError {
    return new ApiError(0, 'NETWORK_ERROR', 'No se pudo conectar con el servidor');
  }

  // La respuesta no es JSON o no tiene la forma esperada: el frontend y la API no coinciden.
  static invalidResponse(status: number): ApiError {
    return new ApiError(status, 'INVALID_RESPONSE', 'La respuesta del servidor no es válida');
  }
}
