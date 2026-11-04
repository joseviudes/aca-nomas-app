import { AppError } from './app-error.js';

export interface FieldIssue {
  path: string;
  message: string;
}

export class ValidationError extends AppError {
  constructor(details: FieldIssue[], message = 'Los datos enviados no son válidos') {
    super(400, 'VALIDATION_ERROR', message, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Necesitás iniciar sesión', code = 'UNAUTHORIZED') {
    super(401, code, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'No tenés permiso para esta acción', code = 'FORBIDDEN') {
    super(403, code, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'No se encontró el recurso', code = 'NOT_FOUND') {
    super(404, code, message);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'El recurso ya existe', code = 'CONFLICT') {
    super(409, code, message);
  }
}
