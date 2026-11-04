import { describe, expect, it } from 'vitest';
import { EnvValidationError, parseEnv } from '../../../src/config/env.js';

describe('parseEnv', () => {
  it('applies defaults when variables are missing', () => {
    expect(parseEnv({})).toEqual({ NODE_ENV: 'development', PORT: 3000 });
  });

  it('converts PORT from string to number', () => {
    expect(parseEnv({ PORT: '4000' }).PORT).toBe(4000);
  });

  it.each(['abc', '0', '70000', '3.5'])('rejects PORT=%s', (port) => {
    expect(() => parseEnv({ PORT: port })).toThrow(EnvValidationError);
  });

  it('rejects an unknown NODE_ENV', () => {
    expect(() => parseEnv({ NODE_ENV: 'staging' })).toThrow(EnvValidationError);
  });
});
