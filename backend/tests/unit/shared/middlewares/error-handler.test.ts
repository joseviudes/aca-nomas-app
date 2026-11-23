import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { AppError } from '../../../../src/shared/errors/app-error.js';
import { NotFoundError } from '../../../../src/shared/errors/http-errors.js';
import { errorHandler } from '../../../../src/shared/middlewares/error-handler.js';

function handle(err: unknown) {
  const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
  errorHandler(err, {} as Request, res as unknown as Response, vi.fn());
  return res;
}

describe('errorHandler', () => {
  it('responds with the status and code of an AppError', () => {
    const res = handle(new NotFoundError('No existe el negocio', 'BUSINESS_NOT_FOUND'));

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: { code: 'BUSINESS_NOT_FOUND', message: 'No existe el negocio', details: [] },
    });
  });

  it('responds 400 when the JSON body is malformed', () => {
    const err = Object.assign(new SyntaxError('Unexpected token'), { type: 'entity.parse.failed' });

    const res = handle(err);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.objectContaining({ code: 'INVALID_JSON' }) }),
    );
  });

  it('hides the details of an unexpected error behind a 500', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const res = handle(new Error('connection refused: password=secret'));

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor', details: [] },
    });
  });

  it('registra en el log un AppError 5xx y no uno 4xx', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    handle(new AppError(500, 'BROKEN_DATA', 'Error interno del servidor'));
    expect(spy).toHaveBeenCalledTimes(1);

    handle(new AppError(404, 'NOT_FOUND', 'No existe'));
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
