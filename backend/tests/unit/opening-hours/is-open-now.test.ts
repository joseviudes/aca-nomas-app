import { DateTime } from 'luxon';
import { describe, expect, it } from 'vitest';
import { isOpenNow } from '../../../src/modules/opening-hours/domain/is-open-now.js';
import type {
  OpeningHours,
  Shift,
} from '../../../src/modules/opening-hours/domain/opening-hours.types.js';

const TIMEZONE = 'America/Argentina/Buenos_Aires';

// El 16/11/2026 es lunes. Las pruebas usan esa semana.
function at(localDateTime: string): Date {
  return DateTime.fromISO(localDateTime, { zone: TIMEZONE }).toJSDate();
}

function hoursWith(shifts: Shift[], extra: Partial<OpeningHours> = {}): OpeningHours {
  return { isPaused: false, closedTodayDate: null, shifts, ...extra };
}

function stateAt(hours: OpeningHours, localDateTime: string) {
  return isOpenNow(hours, at(localDateTime), TIMEZONE).state;
}

const MONDAY_MORNING: Shift = { dayOfWeek: 1, opensAt: '09:00', closesAt: '13:00' };
const MONDAY_AFTERNOON: Shift = { dayOfWeek: 1, opensAt: '17:00', closesAt: '21:00' };
const MONDAY_NIGHT: Shift = { dayOfWeek: 1, opensAt: '19:00', closesAt: '03:00' };

describe('isOpenNow', () => {
  it('usa la semana de las pruebas: el 16/11/2026 es lunes', () => {
    expect(DateTime.fromJSDate(at('2026-11-16T10:00'), { zone: TIMEZONE }).weekday).toBe(1);
  });

  describe('horario semanal', () => {
    const hours = hoursWith([MONDAY_MORNING]);

    it('está abierto dentro de un turno', () => {
      expect(stateAt(hours, '2026-11-16T10:30')).toBe('open');
    });

    it('está abierto justo a la hora de inicio (inicio inclusive)', () => {
      expect(stateAt(hours, '2026-11-16T09:00')).toBe('open');
    });

    it('está cerrado justo a la hora de fin (fin exclusivo)', () => {
      expect(stateAt(hours, '2026-11-16T13:00')).toBe('closed');
    });

    it('está cerrado un minuto antes del inicio', () => {
      expect(stateAt(hours, '2026-11-16T08:59')).toBe('closed');
    });

    it('está cerrado el mismo horario en otro día de la semana', () => {
      expect(stateAt(hours, '2026-11-17T10:30')).toBe('closed');
    });

    it('vuelve a abrir el lunes de la semana siguiente', () => {
      expect(stateAt(hours, '2026-11-23T10:30')).toBe('open');
    });
  });

  describe('turno partido', () => {
    const hours = hoursWith([MONDAY_MORNING, MONDAY_AFTERNOON]);

    it('está abierto en el primer turno', () => {
      expect(stateAt(hours, '2026-11-16T12:59')).toBe('open');
    });

    it('está cerrado entre los dos turnos', () => {
      expect(stateAt(hours, '2026-11-16T15:00')).toBe('closed');
    });

    it('está abierto en el segundo turno', () => {
      expect(stateAt(hours, '2026-11-16T17:00')).toBe('open');
    });
  });

  describe('cruce de medianoche', () => {
    const hours = hoursWith([MONDAY_NIGHT]);

    it('está abierto el lunes antes de la medianoche', () => {
      expect(stateAt(hours, '2026-11-16T23:30')).toBe('open');
    });

    it('sigue abierto el martes de madrugada (cambio de día)', () => {
      expect(stateAt(hours, '2026-11-17T02:59')).toBe('open');
    });

    it('cierra el martes a la hora de fin', () => {
      expect(stateAt(hours, '2026-11-17T03:00')).toBe('closed');
    });

    it('no abre el lunes de madrugada: el turno es del día en que empieza', () => {
      expect(stateAt(hours, '2026-11-16T02:00')).toBe('closed');
    });

    it('cruza la medianoche del domingo al lunes', () => {
      const sunday = hoursWith([{ dayOfWeek: 7, opensAt: '20:00', closesAt: '02:00' }]);
      expect(stateAt(sunday, '2026-11-23T01:00')).toBe('open');
    });

    it('un turno que cierra a las 00:00 termina a la medianoche', () => {
      const untilMidnight = hoursWith([{ dayOfWeek: 1, opensAt: '20:00', closesAt: '00:00' }]);
      expect(stateAt(untilMidnight, '2026-11-16T23:59')).toBe('open');
      expect(stateAt(untilMidnight, '2026-11-17T00:00')).toBe('closed');
    });

    it('un turno con el mismo inicio y fin dura 24 horas', () => {
      const allDay = hoursWith([{ dayOfWeek: 1, opensAt: '08:00', closesAt: '08:00' }]);
      expect(stateAt(allDay, '2026-11-17T07:59')).toBe('open');
      expect(stateAt(allDay, '2026-11-17T08:00')).toBe('closed');
    });
  });

  describe('día sin turnos', () => {
    it('un día sin turnos cargados está cerrado', () => {
      expect(stateAt(hoursWith([MONDAY_MORNING]), '2026-11-18T10:00')).toBe('closed');
    });

    it('un negocio sin ningún turno está cerrado', () => {
      expect(stateAt(hoursWith([]), '2026-11-16T10:00')).toBe('closed');
    });
  });

  describe('hoy no abro', () => {
    it('no abre en la fecha local marcada aunque esté dentro de un turno', () => {
      const hours = hoursWith([MONDAY_MORNING], { closedTodayDate: '2026-11-16' });
      expect(stateAt(hours, '2026-11-16T10:00')).toBe('closed_today');
    });

    it('al día siguiente vuelve el horario normal', () => {
      const hours = hoursWith([MONDAY_MORNING], { closedTodayDate: '2026-11-09' });
      expect(stateAt(hours, '2026-11-16T10:00')).toBe('open');
    });

    it('vale para todo el día, también fuera de los turnos', () => {
      const hours = hoursWith([MONDAY_MORNING], { closedTodayDate: '2026-11-16' });
      expect(stateAt(hours, '2026-11-16T22:00')).toBe('closed_today');
    });

    it('compara con la fecha local, no con la de UTC', () => {
      // 22:00 del lunes en la localidad ya es martes en UTC.
      const hours = hoursWith([MONDAY_NIGHT], { closedTodayDate: '2026-11-17' });
      expect(stateAt(hours, '2026-11-16T22:00')).toBe('open');
    });

    it('gana sobre un turno de ayer que cruza la medianoche', () => {
      const hours = hoursWith([MONDAY_NIGHT], { closedTodayDate: '2026-11-17' });
      expect(stateAt(hours, '2026-11-17T01:00')).toBe('closed_today');
    });
  });

  describe('pausa', () => {
    it('un negocio pausado nunca está abierto, aunque esté dentro de un turno', () => {
      const hours = hoursWith([MONDAY_MORNING], { isPaused: true });
      expect(stateAt(hours, '2026-11-16T10:00')).toBe('paused');
    });

    it('la pausa gana sobre "hoy no abro"', () => {
      const hours = hoursWith([MONDAY_MORNING], {
        isPaused: true,
        closedTodayDate: '2026-11-16',
      });
      expect(stateAt(hours, '2026-11-16T10:00')).toBe('paused');
    });
  });

  describe('zona horaria', () => {
    it('calcula con la hora local de la localidad, no con la de UTC', () => {
      // 12:00 UTC son las 09:00 en Buenos Aires: recién abre.
      const status = isOpenNow(
        hoursWith([MONDAY_MORNING]),
        new Date('2026-11-16T12:00:00Z'),
        TIMEZONE,
      );
      expect(status.state).toBe('open');
    });

    it('el mismo instante da otro estado en otra zona horaria', () => {
      // 12:00 UTC en Madrid son las 13:00: ya cerró.
      const status = isOpenNow(
        hoursWith([MONDAY_MORNING]),
        new Date('2026-11-16T12:00:00Z'),
        'Europe/Madrid',
      );
      expect(status.state).toBe('closed');
    });

    it('falla con una zona horaria que no existe', () => {
      expect(() =>
        isOpenNow(hoursWith([MONDAY_MORNING]), new Date('2026-11-16T12:00:00Z'), 'Mars/Olympus'),
      ).toThrow();
    });
  });

  describe('hora de cierre', () => {
    it('abierto informa la hora de fin del turno', () => {
      const status = isOpenNow(hoursWith([MONDAY_MORNING]), at('2026-11-16T10:00'), TIMEZONE);
      expect(status).toEqual({
        state: 'open',
        closesAt: at('2026-11-16T13:00'),
        nextOpeningAt: null,
      });
    });

    it('un turno que cruza la medianoche cierra al día siguiente', () => {
      const hours = hoursWith([MONDAY_NIGHT]);
      expect(isOpenNow(hours, at('2026-11-16T23:00'), TIMEZONE).closesAt).toEqual(
        at('2026-11-17T03:00'),
      );
      expect(isOpenNow(hours, at('2026-11-17T01:00'), TIMEZONE).closesAt).toEqual(
        at('2026-11-17T03:00'),
      );
    });

    it('si un turno empieza justo cuando termina otro, cierra al final del segundo', () => {
      const hours = hoursWith([
        { dayOfWeek: 1, opensAt: '20:00', closesAt: '00:00' },
        { dayOfWeek: 2, opensAt: '00:00', closesAt: '02:00' },
      ]);
      expect(isOpenNow(hours, at('2026-11-16T21:00'), TIMEZONE).closesAt).toEqual(
        at('2026-11-17T02:00'),
      );
    });

    it('abierto todos los días a toda hora no tiene hora de cierre', () => {
      const allWeek = hoursWith(
        ([1, 2, 3, 4, 5, 6, 7] as const).map((dayOfWeek) => ({
          dayOfWeek,
          opensAt: '00:00',
          closesAt: '00:00',
        })),
      );
      expect(isOpenNow(allWeek, at('2026-11-18T15:00'), TIMEZONE)).toEqual({
        state: 'open',
        closesAt: null,
        nextOpeningAt: null,
      });
    });
  });

  describe('próxima apertura', () => {
    it('antes de abrir informa el inicio del turno de hoy', () => {
      const status = isOpenNow(hoursWith([MONDAY_MORNING]), at('2026-11-16T08:00'), TIMEZONE);
      expect(status).toEqual({
        state: 'closed',
        closesAt: null,
        nextOpeningAt: at('2026-11-16T09:00'),
      });
    });

    it('entre dos turnos informa el inicio del segundo', () => {
      const hours = hoursWith([MONDAY_MORNING, MONDAY_AFTERNOON]);
      expect(isOpenNow(hours, at('2026-11-16T15:00'), TIMEZONE).nextOpeningAt).toEqual(
        at('2026-11-16T17:00'),
      );
    });

    it('después del último turno informa el del próximo día con turnos', () => {
      const hours = hoursWith([
        MONDAY_MORNING,
        { dayOfWeek: 4, opensAt: '10:00', closesAt: '12:00' },
      ]);
      expect(isOpenNow(hours, at('2026-11-16T14:00'), TIMEZONE).nextOpeningAt).toEqual(
        at('2026-11-19T10:00'),
      );
    });

    it('si el único turno de la semana ya pasó, informa el de la semana que viene', () => {
      expect(
        isOpenNow(hoursWith([MONDAY_MORNING]), at('2026-11-16T14:00'), TIMEZONE).nextOpeningAt,
      ).toEqual(at('2026-11-23T09:00'));
    });

    it('con "hoy no abro" saltea los turnos de hoy', () => {
      const hours = hoursWith(
        [MONDAY_MORNING, MONDAY_AFTERNOON, { dayOfWeek: 2, opensAt: '09:00', closesAt: '13:00' }],
        { closedTodayDate: '2026-11-16' },
      );
      expect(isOpenNow(hours, at('2026-11-16T08:00'), TIMEZONE)).toEqual({
        state: 'closed_today',
        closesAt: null,
        nextOpeningAt: at('2026-11-17T09:00'),
      });
    });

    it('con "hoy no abro" y un solo turno en la semana, informa el de la semana que viene', () => {
      const hours = hoursWith([MONDAY_MORNING], { closedTodayDate: '2026-11-16' });
      expect(isOpenNow(hours, at('2026-11-16T08:00'), TIMEZONE).nextOpeningAt).toEqual(
        at('2026-11-23T09:00'),
      );
    });

    it('sin ningún turno no hay próxima apertura', () => {
      expect(isOpenNow(hoursWith([]), at('2026-11-16T10:00'), TIMEZONE)).toEqual({
        state: 'closed',
        closesAt: null,
        nextOpeningAt: null,
      });
    });

    it('pausado no informa hora de cierre ni próxima apertura', () => {
      const hours = hoursWith([MONDAY_MORNING], { isPaused: true });
      expect(isOpenNow(hours, at('2026-11-16T08:00'), TIMEZONE)).toEqual({
        state: 'paused',
        closesAt: null,
        nextOpeningAt: null,
      });
    });
  });
});
