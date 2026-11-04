// Base de todos los errores esperados: el middleware de errores la traduce a una respuesta HTTP.
export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details: unknown[];

  constructor(statusCode: number, code: string, message: string, details: unknown[] = []) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}
