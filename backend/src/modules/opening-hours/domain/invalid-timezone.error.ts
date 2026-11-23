import { IANAZone } from 'luxon';
import { AppError } from '../../../shared/errors/app-error.js';

// Una zona inválida en `localities.timezone` es un dato roto del servidor, no un error del cliente:
// responde 500 y no muestra la zona (D-51). El error se registra completo en el log.
export class InvalidTimezoneError extends AppError {
  constructor(readonly timezone: string) {
    super(500, 'INVALID_LOCALITY_TIMEZONE', 'Error interno del servidor');
  }
}

// Falla fuerte antes de calcular, para no mostrar un estado o un horario inventados.
export function assertValidTimezone(timezone: string): void {
  if (!IANAZone.isValidZone(timezone)) {
    throw new InvalidTimezoneError(timezone);
  }
}
