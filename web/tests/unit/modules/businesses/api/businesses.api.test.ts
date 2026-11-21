import { afterEach, describe, expect, it, vi } from 'vitest';
import { businessDetailFixture } from '@/modules/businesses/api/business-detail.fixtures';
import { businessListFixture } from '@/modules/businesses/api/businesses.fixtures';
import { getBusiness, listBusinesses } from '@/modules/businesses/api/businesses.api';
import { ApiError } from '@/shared/api/api-error';

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

describe('listBusinesses', () => {
  it('asks for the page without limit and without cache', async () => {
    const fetchMock = mockFetch(json(businessListFixture({ page: 2, limit: 20 })));

    await listBusinesses({ page: 2 });

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_URL}/businesses?page=2`,
      expect.objectContaining({ method: 'GET', cache: 'no-store' }),
    );
  });

  it('asks for the first page by default', async () => {
    const fetchMock = mockFetch(json(businessListFixture({ page: 1, limit: 20 })));

    await listBusinesses();

    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/businesses?page=1`, expect.anything());
  });

  it('returns the validated page', async () => {
    const body = businessListFixture({ page: 1, limit: 20 });
    mockFetch(json(body));

    await expect(listBusinesses()).resolves.toEqual(body);
  });

  it('throws INVALID_RESPONSE when the response does not match the contract', async () => {
    mockFetch(json({ data: [], page: 1, limit: 20 }));

    await expectApiError(listBusinesses(), 200, 'INVALID_RESPONSE');
  });

  it('throws NETWORK_ERROR when the API cannot be reached', async () => {
    mockFetch(new TypeError('fetch failed'));

    await expectApiError(listBusinesses(), 0, 'NETWORK_ERROR');
  });

  it('keeps the VALIDATION_ERROR code of a 400', async () => {
    mockFetch(
      json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Los datos enviados no son válidos',
            details: [{ path: 'query.page', message: 'Demasiado chico' }],
          },
        },
        400,
      ),
    );

    await expectApiError(listBusinesses({ page: 1 }), 400, 'VALIDATION_ERROR');
  });
});

describe('getBusiness', () => {
  const espiga = businessDetailFixture('panaderia-la-espiga');
  const recreo = businessDetailFixture('kiosco-el-recreo');

  it('asks for the listing by slug without cache', async () => {
    const fetchMock = mockFetch(json(espiga));

    await getBusiness('panaderia-la-espiga');

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_URL}/businesses/panaderia-la-espiga`,
      expect.objectContaining({ method: 'GET', cache: 'no-store' }),
    );
  });

  it('encodes the slug so it cannot ask for another route', async () => {
    const fetchMock = mockFetch(json(espiga));

    await getBusiness('a/b');

    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/businesses/a%2Fb`, expect.anything());
  });

  it.each([
    ['with description', espiga],
    ['without description', recreo],
  ])('returns the validated listing %s', async (_case, body) => {
    mockFetch(json(body));

    await expect(getBusiness('cualquiera')).resolves.toEqual(body);
  });

  it('keeps the BUSINESS_NOT_FOUND code of a 404', async () => {
    mockFetch(
      json(
        {
          error: { code: 'BUSINESS_NOT_FOUND', message: 'No se encontró el negocio', details: [] },
        },
        404,
      ),
    );

    await expectApiError(getBusiness('no-existe'), 404, 'BUSINESS_NOT_FOUND');
  });

  it.each([
    ['without category', { ...espiga, category: undefined }],
    ['with a description over 80 characters', { ...espiga, description: 'a'.repeat(81) }],
  ])('throws INVALID_RESPONSE for a listing %s', async (_case, body) => {
    mockFetch(json(body));

    await expectApiError(getBusiness('panaderia-la-espiga'), 200, 'INVALID_RESPONSE');
  });

  it('throws NETWORK_ERROR when the API cannot be reached', async () => {
    mockFetch(new TypeError('fetch failed'));

    await expectApiError(getBusiness('panaderia-la-espiga'), 0, 'NETWORK_ERROR');
  });
});
