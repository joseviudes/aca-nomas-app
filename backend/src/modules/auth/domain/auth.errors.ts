import { ConflictError } from '../../../shared/errors/http-errors.js';

// 409 con un code estable: el frontend decide según `EMAIL_TAKEN`, nunca según el mensaje.
export class EmailTakenError extends ConflictError {
  constructor() {
    super('Ya existe una cuenta con ese email', 'EMAIL_TAKEN');
  }
}