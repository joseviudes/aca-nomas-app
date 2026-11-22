import { Card } from '@/shared/ui/Card';
import { cx } from '@/shared/ui/class-names';
import { dayName, isToday, shiftsLabel } from '../domain/weekly-schedule';
import type { WeeklySchedule as WeeklyScheduleData } from '../schemas/business-detail.schema';

// Horario de la semana (US-09): banda mint con los 7 días en filas y hoy resaltado en brand
// (docs/mockup/web.md, sección 5). Se ve entera, sin desplegar, como en el mockup. Cada día es
// una fila y no una tabla, para que a 320 px no haya que desplazarse de costado (docs/diseno.md,
// sección 9). Las horas son las de la localidad, tal como las carga el dueño.
export function WeeklySchedule({ schedule }: { schedule: WeeklyScheduleData }) {
  return (
    <Card as="section" tone="mint" aria-labelledby="horario-titulo">
      <h2 id="horario-titulo" className="font-display text-3xl leading-none md:text-4xl">
        Horario
      </h2>
      <ul className="mt-5 flex flex-col gap-2 lg:w-1/2">
        {schedule.days.map((day) => {
          const today = isToday(day, schedule.today);
          return (
            <li
              key={day.dayOfWeek}
              // El lector de pantalla anuncia la fila de hoy sin depender del color.
              aria-current={today ? 'date' : undefined}
              // flex-wrap: a 320 px, "Miércoles", "Hoy" y un turno no entran en un renglón, y las
              // horas pasan abajo, alineadas a la derecha, en lugar de salirse de la fila.
              className={cx(
                'flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 rounded-field px-3.5 py-2.5 text-base',
                today ? 'bg-brand text-paper' : 'bg-paper text-ink',
              )}
            >
              <span className="flex items-baseline gap-2 font-bold">
                {dayName(day.dayOfWeek)}
                {today && <span className="caps-label text-accent">Hoy</span>}
              </span>
              <span className="ml-auto text-right">{shiftsLabel(day.shifts)}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
