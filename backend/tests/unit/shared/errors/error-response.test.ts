import { describe, expect, it } from 'vitest';
import { toErrorBody } from '../../../../src/shared/errors/error-response.js';

describe('toErrorBody', () => {
  it('builds the standard error format with empty details by default', () => {
    expect(toErrorBody('BUSINESS_NOT_FOUND', 'No existe el negocio')).toEqual({
      error: { code: 'BUSINESS_NOT_FOUND', message: 'No existe el negocio', details: [] },
    });
  });
});
