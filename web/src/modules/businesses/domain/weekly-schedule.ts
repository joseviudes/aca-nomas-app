import type { DaySchedule, Shift, WeeklySchedule } from '../schemas/business-detail.schema';

// Nombres fijos y no Intl: dayOfWeek es un número de la API (1 lunes a 7 domingo), no una fecha,
// y así el nombre no depende del idioma ni de la versión de ICU del servidor.
const DAY_NAMES: Record<number, string> = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  7: 'Domingo',
};

export function dayName(dayOfWeek: DaySchedule['dayOfWeek']): string {
  return DAY_NAMES[dayOfWeek] ?? '';
}

// "08:00 – 13:00 · 17:00 – 21:30". Las horas llegan de la API ya en HH:mm locales, así que no se
// reformatean. Un turno que cruza la medianoche ("19:00 – 01:00") queda en el día en que empieza,
// como lo carga el dueño (RN-02).
export function shiftsLabel(shifts: Shift[]): string {
  if (shifts.length === 0) return 'Cerrado';
  return shifts.map(({ opensAt, closesAt }) => `${opensAt} – ${closesAt}`).join(' · ');
}

// "Hoy" es el día que dice la API (schedule.today), con el reloj de la localidad.
export function isToday(day: DaySchedule, today: WeeklySchedule['today']): boolean {
  return day.dayOfWeek === today;
}
