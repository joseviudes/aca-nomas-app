import cors from 'cors';
import type { RequestHandler } from 'express';

// La web y el panel corren en otro origen que la API: el navegador solo les deja leer la respuesta
// si el origen está en la lista. `credentials` deja viajar la cookie de sesión (D-10, D-28).
// Una request sin encabezado Origin (Postman, curl, otro servidor) pasa igual: CORS es del navegador.
export function createCors(allowedOrigins: readonly string[]): RequestHandler {
  return cors({ origin: [...allowedOrigins], credentials: true });
}
