import { describe, expect, it } from 'vitest';
import { InvalidTimezoneError } from '../../../src/modules/opening-hours/domain/invalid-timezone.error.js';
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

describe('OpeningHoursService.weeklySchedule', () => {
  it('arma el horario semanal con el día de hoy que da el reloj', () => {
    const service = new OpeningHoursService(() => new Date('2026-11-17T13:00:00Z'));

    const schedule = service.weeklySchedule(TUESDAY_MORNING, TIMEZONE);

    expect(schedule.today).toBe(2);
    expect(schedule.days[1]).toEqual({
      dayOfWeek: 2,
      shifts: [{ opensAt: '07:00', closesAt: '13:00' }],
    });
  });

  it('conserva el horario de un negocio en pausa', () => {
    const service = new OpeningHoursService(() => new Date('2026-11-17T13:00:00Z'));

    const schedule = service.weeklySchedule({ ...TUESDAY_MORNING, isPaused: true }, TIMEZONE);

    expect(schedule.days[1]?.shifts).toHaveLength(1);
  });
});

// D-51: una zona inválida en la base falla con un 500 controlado, no da un estado ni un día inventados.
describe('OpeningHoursService con una zona horaria inválida', () => {
  const service = new OpeningHoursService(() => new Date('2026-11-17T13:00:00Z'));

  it('currentStatus lanza InvalidTimezoneError', () => {
    expect(() => service.currentStatus(TUESDAY_MORNING, 'Mantilla/Nunca')).toThrow(
      InvalidTimezoneError,
    );
  });

  it('weeklySchedule lanza InvalidTimezoneError', () => {
    expect(() => service.weeklySchedule(TUESDAY_MORNING, '')).toThrow(InvalidTimezoneError);
  });

  it('responde 500 con un código estable y sin mostrar la zona', () => {
    const error = new InvalidTimezoneError('Mantilla/Nunca');

    expect(error.statusCode).toBe(500);
    expect(error.code).toBe('INVALID_LOCALITY_TIMEZONE');
    expect(error.message).not.toContain('Mantilla');
  });
});
