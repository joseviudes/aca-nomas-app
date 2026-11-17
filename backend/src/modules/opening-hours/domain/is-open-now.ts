import { DateTime } from 'luxon';
import type { BusinessStatus, OpeningHours, Shift } from './opening-hours.types.js';

interface ShiftInterval {
  start: DateTime;
  end: DateTime;
}

const DAYS_IN_WEEK = 7;

// Estado del negocio en el instante `now`, visto desde la zona horaria de la localidad (RN-01),
// con la hora de cierre o la próxima apertura (RN-04). Es una función pura: no lee el reloj del sistema (RN-10).
export function isOpenNow(hours: OpeningHours, now: Date, timezone: string): BusinessStatus {
  if (hours.isPaused) {
    return { state: 'paused', closesAt: null, nextOpeningAt: null };
  }

  const localNow = DateTime.fromJSDate(now, { zone: timezone });
  // Desde ayer, por los turnos que cruzan la medianoche y siguen abiertos hoy (RN-02), hasta
  // el mismo día de la semana que viene, por si el único turno de la semana ya pasó.
  const intervals = shiftIntervals(hours.shifts, localNow, -1, DAYS_IN_WEEK);

  // Gana aunque siga corriendo un turno de ayer que cruzó la medianoche: el dueño avisó que hoy no abre.
  const today = localNow.toISODate();
  if (hours.closedTodayDate === today) {
    return {
      state: 'closed_today',
      closesAt: null,
      nextOpeningAt: nextOpening(intervals, localNow, today),
    };
  }

  const current = intervals.find(({ start, end }) => start <= localNow && localNow < end);
  if (current) {
    return {
      state: 'open',
      closesAt: closingTime(intervals, current, localNow),
      nextOpeningAt: null,
    };
  }

  return { state: 'closed', closesAt: null, nextOpeningAt: nextOpening(intervals, localNow) };
}

// Si un turno empieza justo cuando termina otro (20:00–00:00 y 00:00–02:00), el negocio no cierra
// en el medio: la hora de cierre es la del último turno de la cadena.
function closingTime(
  intervals: ShiftInterval[],
  current: ShiftInterval,
  localNow: DateTime,
): Date | null {
  let end = current.end;
  for (const interval of intervals) {
    if (interval.start <= end && interval.end > end) {
      end = interval.end;
    }
  }

  // Una semana entera sin cerrar es un horario que no cierra nunca: se repite igual cada semana.
  return end >= localNow.plus({ days: DAYS_IN_WEEK }) ? null : end.toJSDate();
}

function nextOpening(
  intervals: ShiftInterval[],
  localNow: DateTime,
  skippedDate?: string,
): Date | null {
  const next = intervals.find(({ start }) => start > localNow && start.toISODate() !== skippedDate);
  return next ? next.start.toJSDate() : null;
}

// Ubica cada turno en las fechas reales entre `fromDay` y `toDay` (contados desde hoy), ordenados por inicio.
function shiftIntervals(
  shifts: Shift[],
  localNow: DateTime,
  fromDay: number,
  toDay: number,
): ShiftInterval[] {
  const intervals: ShiftInterval[] = [];

  for (let offset = fromDay; offset <= toDay; offset++) {
    const day = localNow.plus({ days: offset }).startOf('day');
    for (const shift of shifts.filter(({ dayOfWeek }) => dayOfWeek === day.weekday)) {
      intervals.push(toInterval(shift, day));
    }
  }

  return intervals.sort((a, b) => a.start.toMillis() - b.start.toMillis());
}

function toInterval(shift: Shift, day: DateTime): ShiftInterval {
  const start = atTime(day, shift.opensAt);
  const end = atTime(day, shift.closesAt);
  // Un fin menor o igual al inicio es del día siguiente (RN-02).
  return { start, end: end <= start ? end.plus({ days: 1 }) : end };
}

function atTime(day: DateTime, time: string): DateTime {
  const { hour, minute } = DateTime.fromFormat(time, 'HH:mm');
  return day.set({ hour, minute });
}
