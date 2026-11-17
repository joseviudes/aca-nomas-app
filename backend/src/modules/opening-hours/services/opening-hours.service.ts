import { isOpenNow } from '../domain/is-open-now.js';
import type { BusinessStatus, OpeningHours } from '../domain/opening-hours.types.js';

// Puerta de entrada de otros módulos al cálculo de "abierto ahora": lo usan por este servicio,
// no por el dominio. isOpenNow no lee el reloj (RN-10); acá se le pasa la hora actual.
export class OpeningHoursService {
  // El reloj se inyecta para que las pruebas fijen el momento.
  constructor(private readonly now: () => Date = () => new Date()) {}

  currentStatus(hours: OpeningHours, timezone: string): BusinessStatus {
    return isOpenNow(hours, this.now(), timezone);
  }
}
