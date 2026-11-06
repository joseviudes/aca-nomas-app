import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { ApiError } from '@/shared/api/api-error';
import { http } from '@/shared/api/http-client';

// En desarrollo y en pruebas, NEXT_PUBLIC_API_URL vale http://localhost:3000/api (config/env.ts).
const API_URL = 'http://localhost:3000/api';

function mockFetch(response: Response | Error) {
  const fetchMock = vi.fn(() =>
    response instanceof Error ? Promise.reject(response) : Promise.resolve(response),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

async function expectApiError(promise: Promise<unknown>, status: number, code: string) {
  const error = await promise.catch((e: unknown) => e);
  expect(error).toBeInstanceOf(ApiError);
  expect(error).toMatchObject({ status, code });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('http', () => {
  it('builds the URL and always sends the session cookie', async () => {
    const fetchMock = mockFetch(json({ ok: true }));

    await http.get('/businesses');

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_URL}/businesses`,
      expect.objectContaining({ method: 'GET', credentials: 'include' }),
    );
  });

  it('sends the body as JSON with its content type', async () => {
    const fetchMock = mockFetch(json({ id: 1 }, 201));

    await http.post('/auth/login', { email: 'owner1@example.com' });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'owner1@example.com' }),
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }) as unknown,
      }),
    );
  });

  it('returns the parsed JSON', async () => {
    mockFetch(json({ a: 1 }));

    await expect(http.get('/x')).resolves.toEqual({ a: 1 });
  });

  it('returns undefined on 204 No Content', async () => {
    mockFetch(new Response(null, { status: 204 }));

    await expect(http.delete('/x')).resolves.toBeUndefined();
  });

  it('validates the response with the schema and keeps only its fields', async () => {
    mockFetch(json({ a: 2, extra: true }));

    await expect(http.get('/x', { schema: z.object({ a: z.number() }) })).resolves.toEqual({
      a: 2,
    });
  });

  it('throws INVALID_RESPONSE when the response does not match the schema', async () => {
    mockFetch(json({ a: 'not a number' }));

    await expectApiError(
      http.get('/x', { schema: z.object({ a: z.number() }) }),
      200,
      'INVALID_RESPONSE',
    );
  });

  it('throws INVALID_RESPONSE when a successful response is not JSON', async () => {
    mockFetch(new Response('<html></html>', { status: 200 }));

    await expectApiError(http.get('/x'), 200, 'INVALID_RESPONSE');
  });

  it('throws the API error code and message', async () => {
    mockFetch(
      json({ error: { code: 'BUSINESS_NOT_FOUND', message: 'No existe el negocio' } }, 404),
    );

    const error = await http.get('/x').catch((e: unknown) => e);

    expect(error).toMatchObject({
      status: 404,
      code: 'BUSINESS_NOT_FOUND',
      message: 'No existe el negocio',
    });
  });

  it('throws UNKNOWN_ERROR when an error response has no API format', async () => {
    mockFetch(new Response('Bad Gateway', { status: 502 }));

    await expectApiError(http.get('/x'), 502, 'UNKNOWN_ERROR');
  });

  it('throws NETWORK_ERROR when the API cannot be reached', async () => {
    mockFetch(new TypeError('fetch failed'));

    await expectApiError(http.get('/x'), 0, 'NETWORK_ERROR');
  });
});
