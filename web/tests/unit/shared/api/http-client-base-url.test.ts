import { afterEach, describe, expect, it, vi } from 'vitest';

// env.ts se valida al importarse: cada prueba define las variables y vuelve a importar el módulo.
async function loadHttp(vars: Record<string, string>) {
  vi.resetModules();
  for (const [name, value] of Object.entries(vars)) vi.stubEnv(name, value);
  const { http } = await import('@/shared/api/http-client');
  return http;
}

function mockFetch() {
  const fetchMock = vi.fn(() => Promise.resolve(new Response('{}', { status: 200 })));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('http base URL on the server', () => {
  it('uses API_INTERNAL_URL when it is set', async () => {
    const http = await loadHttp({
      NEXT_PUBLIC_API_URL: 'http://localhost:3000/api',
      API_INTERNAL_URL: 'http://api:3000/api',
    });
    const fetchMock = mockFetch();

    await http.get('/categories');

    expect(fetchMock).toHaveBeenCalledWith('http://api:3000/api/categories', expect.anything());
  });

  it('falls back to NEXT_PUBLIC_API_URL', async () => {
    const http = await loadHttp({ NEXT_PUBLIC_API_URL: 'http://localhost:3000/api' });
    const fetchMock = mockFetch();

    await http.get('/categories');

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/api/categories',
      expect.anything(),
    );
  });

  it('uses NEXT_PUBLIC_API_URL in the browser even if API_INTERNAL_URL is set', async () => {
    const http = await loadHttp({
      NEXT_PUBLIC_API_URL: 'http://localhost:3000/api',
      API_INTERNAL_URL: 'http://api:3000/api',
    });
    vi.stubGlobal('window', {});
    const fetchMock = mockFetch();

    await http.get('/categories');

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/api/categories',
      expect.anything(),
    );
  });
});
