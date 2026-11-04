import { describe, expect, it } from 'vitest';
import { EnvValidationError, parseEnv } from '../../../src/config/env.js';

const DATABASE_URL = 'postgresql://user:password@localhost:5432/aca_nomas';

describe('parseEnv', () => {
  it('applies defaults when optional variables are missing', () => {
    expect(parseEnv({ DATABASE_URL })).toEqual({
      NODE_ENV: 'development',
      PORT: 3000,
      DATABASE_URL,
    });
  });

  it('converts PORT from string to number', () => {
    expect(parseEnv({ DATABASE_URL, PORT: '4000' }).PORT).toBe(4000);
  });

  it.each(['abc', '0', '70000', '3.5'])('rejects PORT=%s', (port) => {
    expect(() => parseEnv({ DATABASE_URL, PORT: port })).toThrow(EnvValidationError);
  });

  it('rejects an unknown NODE_ENV', () => {
    expect(() => parseEnv({ DATABASE_URL, NODE_ENV: 'staging' })).toThrow(EnvValidationError);
  });

  it('requires DATABASE_URL', () => {
    expect(() => parseEnv({})).toThrow(/DATABASE_URL/);
  });

  it.each(['not-a-url', 'mysql://user@localhost/aca_nomas'])('rejects DATABASE_URL=%s', (url) => {
    expect(() => parseEnv({ DATABASE_URL: url })).toThrow(EnvValidationError);
  });

  it('accepts the postgres:// shorthand', () => {
    const url = 'postgres://user@localhost:5432/aca_nomas';
    expect(parseEnv({ DATABASE_URL: url }).DATABASE_URL).toBe(url);
  });
});
