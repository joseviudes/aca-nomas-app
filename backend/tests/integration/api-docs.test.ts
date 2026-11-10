import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp, type AppOptions } from '../../src/app.js';

async function startApp(options: AppOptions) {
  const server: Server = createApp(options).listen(0);
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const { port } = server.address() as AddressInfo;
  return { server, baseUrl: `http://127.0.0.1:${port}` };
}

interface OperationDoc {
  responses: Record<string, { content: Record<string, { example?: unknown }> }>;
}

const stop = (server: Server) => new Promise<void>((resolve) => server.close(() => resolve()));

describe('API docs enabled (D-34)', () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    ({ server, baseUrl } = await startApp({ apiDocs: true }));
  });

  afterAll(() => stop(server));

  it('serves the OpenAPI document with the documented endpoints', async () => {
    const response = await fetch(`${baseUrl}/api/openapi.json`);
    const document = (await response.json()) as {
      openapi: string;
      servers: { url: string }[];
      paths: Record<string, Record<string, unknown>>;
    };

    expect(response.status).toBe(200);
    expect(document.openapi).toBe('3.1.0');
    expect(document.servers).toEqual([{ url: '/api' }]);
    expect(document.paths['/health']?.get).toBeDefined();
    expect(document.paths['/businesses']?.get).toBeDefined();
  });

  // La validación corta antes del repositorio, así que no hace falta la base.
  it('documents the real 400 of GET /businesses as its example', async () => {
    const document = (await (await fetch(`${baseUrl}/api/openapi.json`)).json()) as {
      paths: Record<string, Record<string, OperationDoc>>;
    };
    const documented =
      document.paths['/businesses']?.get?.responses['400']?.content['application/json']?.example;

    const response = await fetch(`${baseUrl}/api/businesses?limit=500`);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual(documented);
  });

  it('serves the Swagger UI page', async () => {
    const response = await fetch(`${baseUrl}/api/docs/`);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/html');
    expect(await response.text()).toContain('swagger-ui');
  });

  it('redirects the root to the Swagger UI', async () => {
    const response = await fetch(`${baseUrl}/`, { redirect: 'manual' });

    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('/api/docs/');
  });
});

describe('API docs disabled', () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    ({ server, baseUrl } = await startApp({ apiDocs: false }));
  });

  afterAll(() => stop(server));

  it.each(['/', '/api/openapi.json', '/api/docs/'])('answers 404 on %s', async (path) => {
    const response = await fetch(`${baseUrl}${path}`);

    expect(response.status).toBe(404);
  });
});
