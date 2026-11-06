import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import express from 'express';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createCors } from '../../../../src/shared/middlewares/cors.js';

const ALLOWED = 'http://localhost:3002';

describe('createCors', () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    const app = express();
    app.use(createCors([ALLOWED]));
    app.get('/ping', (_req, res) => {
      res.json({ ok: true });
    });

    server = await new Promise<Server>((resolve) => {
      const listening = app.listen(0, () => resolve(listening));
    });
    baseUrl = `http://localhost:${(server.address() as AddressInfo).port}`;
  });

  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  it('allows an origin in the list and lets the session cookie travel', async () => {
    const res = await fetch(`${baseUrl}/ping`, { headers: { Origin: ALLOWED } });

    expect(res.headers.get('access-control-allow-origin')).toBe(ALLOWED);
    expect(res.headers.get('access-control-allow-credentials')).toBe('true');
  });

  it('answers the preflight request of an allowed origin', async () => {
    const res = await fetch(`${baseUrl}/ping`, {
      method: 'OPTIONS',
      headers: { Origin: ALLOWED, 'Access-Control-Request-Method': 'PATCH' },
    });

    expect(res.status).toBe(204);
    expect(res.headers.get('access-control-allow-origin')).toBe(ALLOWED);
  });

  it('does not allow an origin outside the list', async () => {
    const res = await fetch(`${baseUrl}/ping`, { headers: { Origin: 'https://evil.example.com' } });

    expect(res.headers.get('access-control-allow-origin')).toBeNull();
  });
});
