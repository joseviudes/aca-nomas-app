import type { z } from 'zod';
import { env } from '../../config/env';
import { ApiError } from './api-error';

// Único lugar que llama a `fetch` (D-30). Los módulos lo usan desde su carpeta api/.
type RequestOptions<T> = Omit<RequestInit, 'body' | 'headers'> & {
  body?: unknown;
  headers?: Record<string, string>;
  // Si se pasa, la respuesta se valida: si la API cambia de forma, falla acá y no en la pantalla.
  schema?: z.ZodType<T>;
};

async function request<T>(path: string, options: RequestOptions<T> = {}): Promise<T> {
  const { body, headers, schema, ...init } = options;

  let response: Response;
  try {
    response = await fetch(`${env.VITE_API_URL}${path}`, {
      ...init,
      // Siempre: así viaja la cookie de sesión (D-10, D-28).
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw ApiError.network();
  }

  // 204 No Content (por ejemplo, un DELETE): no hay cuerpo para leer.
  const data: unknown =
    response.status === 204 ? undefined : await response.json().catch(() => null);

  if (!response.ok) {
    throw ApiError.fromResponse(response.status, data);
  }
  return schema ? schema.parse(data) : (data as T);
}

export const http = {
  get: <T>(path: string, options?: RequestOptions<T>) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions<T>) =>
    request<T>(path, { ...options, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions<T>) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions<T>) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  delete: <T>(path: string, options?: RequestOptions<T>) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
