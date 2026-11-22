import { describe, expect, it } from 'vitest';
import type { Shift } from '../../../src/modules/opening-hours/domain/opening-hours.types.js';
import { weeklySchedule } from '../../../src/modules/opening-hours/domain/weekly-schedule.js';

const TIMEZONE = 'America/Argentina/Buenos_Aires';

// Martes 17/11/2026 a las 10:00 de Mantilla (UTC-3).
const TUESDAY_10_AM = new Date('2026-11-17T13:00:00Z');

describe('weeklySchedule', () => {
  it('devuelve siempre los 7 días, de lunes a domingo, aunque no tengan turnos', () => {
    const schedule = weeklySchedule([], TUESDAY_10_AM, TIMEZONE);

    expect(schedule.days.map(({ dayOfWeek }) => dayOfWeek)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(schedule.days.every(({ shifts }) => shifts.length === 0)).toBe(true);
  });

  it('agrupa los turnos en su día, con las horas locales tal como se guardaron', () => {
    const shifts: Shift[] = [
      { dayOfWeek: 2, opensAt: '07:30', closesAt: '13:00' },
      { dayOfWeek: 6, opensAt: '09:00', closesAt: '13:00' },
    ];

    const { days } = weeklySchedule(shifts, TUESDAY_10_AM, TIMEZONE);

    expect(days[1]).toEqual({ dayOfWeek: 2, shifts: [{ opensAt: '07:30', closesAt: '13:00' }] });
    expect(days[5]).toEqual({ dayOfWeek: 6, shifts: [{ opensAt: '09:00', closesAt: '13:00' }] });
    expect(days[0]?.shifts).toEqual([]);
  });

  it('ordena los turnos partidos de un día por hora de inicio', () => {
    const shifts: Shift[] = [
      { dayOfWeek: 1, opensAt: '17:00', closesAt: '20:30' },
      { dayOfWeek: 1, opensAt: '07:30', closesAt: '13:00' },
    ];

    const { days } = weeklySchedule(shifts, TUESDAY_10_AM, TIMEZONE);

    expect(days[0]?.shifts).toEqual([
      { opensAt: '07:30', closesAt: '13:00' },
      { opensAt: '17:00', closesAt: '20:30' },
    ]);
  });

  it('deja el turno que cruza la medianoche en el día en que empieza', () => {
    const shifts: Shift[] = [{ dayOfWeek: 2, opensAt: '19:00', closesAt: '01:00' }];

    const { days } = weeklySchedule(shifts, TUESDAY_10_AM, TIMEZONE);

    expect(days[1]?.shifts).toEqual([{ opensAt: '19:00', closesAt: '01:00' }]);
    expect(days[2]?.shifts).toEqual([]);
  });

  it('informa la zona horaria y el día de hoy de la localidad', () => {
    expect(weeklySchedule([], TUESDAY_10_AM, TIMEZONE)).toMatchObject({
      timezone: TIMEZONE,
      today: 2,
    });
  });

  // 01:00 UTC del miércoles todavía es martes 22:00 en Mantilla: el "hoy" no es el del servidor.
  it('toma el día de hoy en la zona de la localidad, no en UTC', () => {
    const wednesdayUtc = new Date('2026-11-18T01:00:00Z');

    expect(weeklySchedule([], wednesdayUtc, TIMEZONE).today).toBe(2);
    expect(weeklySchedule([], wednesdayUtc, 'Asia/Tokyo').today).toBe(3);
  });

  it('numera el domingo como 7', () => {
    const sunday = new Date('2026-11-22T15:00:00Z');

    expect(weeklySchedule([], sunday, TIMEZONE).today).toBe(7);
  });
});
