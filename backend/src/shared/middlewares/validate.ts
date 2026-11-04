import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { ValidationError, type FieldIssue } from '../errors/http-errors.js';

interface RequestSchemas {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

type Location = keyof RequestSchemas;

const LOCATIONS: Location[] = ['body', 'params', 'query'];

// Valida y reemplaza cada parte de la request por su versión parseada (con tipos y valores por defecto).
export function validate(schemas: RequestSchemas): RequestHandler {
  return (req, _res, next) => {
    const issues: FieldIssue[] = [];

    for (const location of LOCATIONS) {
      const schema = schemas[location];
      if (!schema) continue;

      const result = schema.safeParse(req[location]);
      if (!result.success) {
        for (const issue of result.error.issues) {
          issues.push({ path: [location, ...issue.path].join('.'), message: issue.message });
        }
        continue;
      }

      // En Express 5 req.query es un getter: hay que redefinirlo en vez de asignarlo.
      Object.defineProperty(req, location, { value: result.data, writable: true });
    }

    if (issues.length > 0) {
      next(new ValidationError(issues));
      return;
    }
    next();
  };
}
