import { DateTime } from 'luxon';
import type { DayOfWeek, Shift } from './opening-hours.types.js';

export interface DaySchedule {
  dayOfWeek: DayOfWeek;
  // Ordenados por hora de inicio. Vacío si ese día no abre.
  shifts: { opensAt: string; closesAt: string }[];
}

export interface WeeklySchedule {
  timezone: string;
  // Día de la semana de hoy en la localidad, para marcar "Hoy" sin que el visitante use la hora de su navegador.
  today: DayOfWeek;
  // Siempre 7 días, de lunes (1) a domingo (7).
  days: DaySchedule[];
}

const DAYS: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 7];

// Horario semanal para mostrar: las horas quedan locales de la localidad, tal como se guardaron.
// No decide si está abierto (eso es isOpenNow): un negocio pausado conserva su horario.
// Es una función pura: no lee el reloj (RN-10).
export function weeklySchedule(shifts: Shift[], now: Date, timezone: string): WeeklySchedule {
  return {
    timezone,
    today: DateTime.fromJSDate(now, { zone: timezone }).weekday as DayOfWeek,
    days: DAYS.map((dayOfWeek) => ({
      dayOfWeek,
      shifts: shifts
        .filter((shift) => shift.dayOfWeek === dayOfWeek)
        .map(({ opensAt, closesAt }) => ({ opensAt, closesAt }))
        .sort((a, b) => a.opensAt.localeCompare(b.opensAt)),
    })),
  };
}
