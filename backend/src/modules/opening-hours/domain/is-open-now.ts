import { DateTime } from 'luxon';
import type { BusinessStatus, OpeningHours, Shift } from './opening-hours.types.js';

interface ShiftInterval {
  start: DateTime;
  end: DateTime;
}

// Estado del negocio en el instante `now`, visto desde la zona horaria de la localidad (RN-01).
// Es una función pura: no lee el reloj del sistema (RN-10).
export function isOpenNow(hours: OpeningHours, now: Date, timezone: string): BusinessStatus {
  if (hours.isPaused) {
    return { state: 'paused' };
  }

  const localNow = DateTime.fromJSDate(now, { zone: timezone });

  // Gana aunque siga corriendo un turno de ayer que cruzó la medianoche: el dueño avisó que hoy no abre.
  if (hours.closedTodayDate === localNow.toISODate()) {
    return { state: 'closed_today' };
  }

  // Ayer entra por los turnos que cruzan la medianoche y siguen abiertos hoy (RN-02).
  const isOpen = shiftIntervals(hours.shifts, localNow, -1, 0).some(
    ({ start, end }) => start <= localNow && localNow < end,
  );

  return { state: isOpen ? 'open' : 'closed' };
}

// Ubica cada turno en las fechas reales entre `fromDay` y `toDay` (contados desde hoy), en orden.
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
