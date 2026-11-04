import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { NotFoundError } from '../../../../src/shared/errors/http-errors.js';
import { notFound } from '../../../../src/shared/middlewares/not-found.js';

describe('notFound', () => {
  it('forwards a ROUTE_NOT_FOUND error', () => {
    const next = vi.fn();

    notFound({ method: 'GET', path: '/api/nada' } as Request, {} as Response, next);

    const error = next.mock.calls[0]?.[0] as NotFoundError;
    expect(error).toBeInstanceOf(NotFoundError);
    expect(error.code).toBe('ROUTE_NOT_FOUND');
  });
});
