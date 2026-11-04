import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { ValidationError } from '../../../../src/shared/errors/http-errors.js';
import { validate } from '../../../../src/shared/middlewares/validate.js';

function run(middleware: ReturnType<typeof validate>, req: Partial<Request>) {
  const next = vi.fn();
  middleware(req as Request, {} as Response, next);
  return next;
}

describe('validate', () => {
  const schemas = {
    body: z.object({ name: z.string().min(1) }),
    query: z.object({ page: z.coerce.number().int().min(1).default(1) }),
  };

  it('replaces body and query with the parsed values', () => {
    const req: Partial<Request> = { body: { name: 'Kiosco' }, query: {} };

    const next = run(validate(schemas), req);

    expect(next).toHaveBeenCalledWith();
    expect(req.body).toEqual({ name: 'Kiosco' });
    expect(req.query).toEqual({ page: 1 });
  });

  it('collects the issues of every location in a ValidationError', () => {
    const next = run(validate(schemas), { body: { name: '' }, query: { page: '0' } });

    const error = next.mock.calls[0]?.[0] as ValidationError;
    expect(error).toBeInstanceOf(ValidationError);
    expect(error.statusCode).toBe(400);
    expect(error.details).toEqual([
      expect.objectContaining({ path: 'body.name' }),
      expect.objectContaining({ path: 'query.page' }),
    ]);
  });
});
