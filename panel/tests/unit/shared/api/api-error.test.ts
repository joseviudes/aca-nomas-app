import { describe, expect, it } from 'vitest';
import { ApiError } from '../../../../src/shared/api/api-error';

describe('ApiError.fromResponse', () => {
  it('reads code, message and details from the API error format', () => {
    const error = ApiError.fromResponse(400, {
      error: { code: 'VALIDATION_ERROR', message: 'Datos inválidos', details: [{ path: 'email' }] },
    });

    expect(error).toMatchObject({
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'Datos inválidos',
      details: [{ path: 'email' }],
    });
  });

  it('defaults details to an empty list', () => {
    const error = ApiError.fromResponse(404, {
      error: { code: 'NOT_FOUND', message: 'No existe' },
    });

    expect(error.details).toEqual([]);
  });

  it.each([null, 'texto', { message: 'sin code' }])('returns UNKNOWN_ERROR for %j', (body) => {
    expect(ApiError.fromResponse(500, body).code).toBe('UNKNOWN_ERROR');
  });
});
