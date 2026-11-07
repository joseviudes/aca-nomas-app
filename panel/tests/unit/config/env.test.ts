import { describe, expect, it } from 'vitest';
import { parseEnv } from '../../../src/config/env';

describe('parseEnv', () => {
  it('uses localhost outside production', () => {
    expect(parseEnv({}, false).VITE_API_URL).toBe('http://localhost:3000/api');
  });

  it('requires VITE_API_URL in production', () => {
    expect(() => parseEnv({}, true)).toThrow(/obligatoria en producción/);
  });

  it('accepts VITE_API_URL in production and drops the trailing slash', () => {
    expect(parseEnv({ VITE_API_URL: 'https://api.acanomas.com/api/' }, true).VITE_API_URL).toBe(
      'https://api.acanomas.com/api',
    );
  });

  it.each(['not-a-url', 'ftp://api.acanomas.com'])('rejects VITE_API_URL=%s', (url) => {
    expect(() => parseEnv({ VITE_API_URL: url }, false)).toThrow(/Variables de entorno inválidas/);
  });
});
