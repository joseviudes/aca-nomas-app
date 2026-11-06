import type { z } from 'zod';
import { env } from '@/config/env';
import { ApiError } from './api-error';

// Único lugar que llama a `fetch` (D-30). Los módulos lo usan desde su carpeta api/.
// Hay una copia en panel/src/shared/api/: un cambio acá se repite allá (D-31). La única
// diferencia es `apiBaseUrl`, porque el panel no corre en un servidor.
// Se usa `fetch` y no Axios porque Next lo extiende con caché: se pueden pasar
// `next: { revalidate, tags }` en las opciones y llegan tal cual.

// En el navegador, la URL pública. En el servidor de Next, la interna si existe (D-33).
function apiBaseUrl(): string {
  const isServer = typeof window === 'undefined';
  return isServer ? (env.API_INTERNAL_URL ?? env.NEXT_PUBLIC_API_URL) : env.NEXT_PUBLIC_API_URL;
}

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
    response = await fetch(`${apiBaseUrl()}${path}`, {
      ...init,
      // En el navegador hace viajar la cookie de sesión (D-10, D-28). En el servidor no tiene efecto.
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
  let data: unknown;
  if (response.status !== 204) {
    try {
      data = await response.json();
    } catch {
      // Una respuesta exitosa sin JSON válido es un error: no se puede tratar como un dato.
      if (response.ok) throw ApiError.invalidResponse(response.status);
      data = null;
    }
  }

  if (!response.ok) {
    throw ApiError.fromResponse(response.status, data);
  }
  if (!schema) return data as T;

  // Siempre ApiError: las pantallas manejan un solo tipo de error, nunca un ZodError.
  const parsed = schema.safeParse(data);
  if (!parsed.success) throw ApiError.invalidResponse(response.status);
  return parsed.data;
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
