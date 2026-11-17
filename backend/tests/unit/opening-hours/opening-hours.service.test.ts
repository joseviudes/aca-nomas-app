import { describe, expect, it } from 'vitest';
import type { OpeningHours } from '../../../src/modules/opening-hours/domain/opening-hours.types.js';
import { OpeningHoursService } from '../../../src/modules/opening-hours/services/opening-hours.service.js';

const TIMEZONE = 'America/Argentina/Buenos_Aires';

// Abre los martes de 07:00 a 13:00 de Mantilla (10:00 a 16:00 UTC).
const TUESDAY_MORNING: OpeningHours = {
  isPaused: false,
  closedTodayDate: null,
  shifts: [{ dayOfWeek: 2, opensAt: '07:00', closesAt: '13:00' }],
};

describe('OpeningHoursService.currentStatus', () => {
  it('calcula el estado con la hora que da el reloj', () => {
    const service = new OpeningHoursService(() => new Date('2026-11-17T13:00:00Z'));

    expect(service.currentStatus(TUESDAY_MORNING, TIMEZONE)).toEqual({
      state: 'open',
      closesAt: new Date('2026-11-17T16:00:00Z'),
      nextOpeningAt: null,
    });
  });

  // Un servicio vive mientras corre la API: no puede quedarse con la hora en que se creó.
  it('lee el reloj en cada consulta', () => {
    let now = new Date('2026-11-17T13:00:00Z');
    const service = new OpeningHoursService(() => now);

    expect(service.currentStatus(TUESDAY_MORNING, TIMEZONE).state).toBe('open');

    now = new Date('2026-11-17T16:00:00Z');
    expect(service.currentStatus(TUESDAY_MORNING, TIMEZONE).state).toBe('closed');
  });
});
