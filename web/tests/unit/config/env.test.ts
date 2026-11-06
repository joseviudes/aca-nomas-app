import { describe, expect, it } from 'vitest';
import { parseEnv } from '@/config/env';

describe('parseEnv', () => {
  it('uses localhost outside production', () => {
    expect(parseEnv({}, false).NEXT_PUBLIC_API_URL).toBe('http://localhost:3000/api');
  });

  it('requires NEXT_PUBLIC_API_URL in production', () => {
    expect(() => parseEnv({}, true)).toThrow(/obligatoria en producción/);
  });

  it('accepts NEXT_PUBLIC_API_URL in production and drops the trailing slash', () => {
    expect(
      parseEnv({ NEXT_PUBLIC_API_URL: 'https://api.acanomas.com/api/' }, true).NEXT_PUBLIC_API_URL,
    ).toBe('https://api.acanomas.com/api');
  });

  it.each(['not-a-url', 'ftp://api.acanomas.com'])('rejects NEXT_PUBLIC_API_URL=%s', (url) => {
    expect(() => parseEnv({ NEXT_PUBLIC_API_URL: url }, false)).toThrow(
      /Variables de entorno inválidas/,
    );
  });
});
