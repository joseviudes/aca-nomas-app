import type { BusinessStatus } from '../schemas/business-list.schema';

// Hasta cuántos minutos el cambio se considera cercano y se muestra "en N min" en negrita.
export const SOON_MINUTES = 60;

export type StatusText = {
  // Línea completa ("Cierra el jueves a las 02:00").
  text: string;
  // Versión corta, para mostrar al lado de la etiqueta en el celular ("Cierra jueves 02:00").
  shortText: string;
  emphasized: boolean;
};

const MS_PER_MINUTE = 60_000;
const MS_PER_DAY = 86_400_000;

// Línea de texto bajo la etiqueta de estado (docs/mockup/web.md, sección 1). El estado lo decide
// la API: esta función solo dice cuándo cambia. Es pura: la hora actual y la zona de la localidad
// (schedule.timezone) entran por parámetro, así se prueba con cualquier fecha y no depende del
// reloj ni de la zona del navegador. Devuelve null cuando no hay línea que mostrar:
// - pausado: la API no guarda el motivo de la pausa, y inventarlo ("por vacaciones") sería mentir;
// - falta el dato (closesAt o nextOpeningAt en null, por ejemplo un negocio sin turnos);
// - el instante ya pasó (la respuesta quedó vieja) o no es una fecha válida;
// - la zona horaria no es válida.
export function statusText(status: BusinessStatus, now: Date, timeZone: string): StatusText | null {
  switch (status.state) {
    case 'open':
      return openText(status.closesAt, now, timeZone);
    case 'closed':
      return closedText(status.nextOpeningAt, now, timeZone);
    case 'closed_today':
      return closedTodayText(status.nextOpeningAt, now, timeZone);
    case 'paused':
      return null;
  }
}

type Moment = { minutes: number; time: string; dayDiff: number; weekday: string };

function openText(closesAt: string | null, now: Date, timeZone: string): StatusText | null {
  const moment = momentFrom(closesAt, now, timeZone);
  if (!moment) return null;

  if (moment.minutes <= SOON_MINUTES) {
    return {
      text: `Cierra en ${moment.minutes} min · ${moment.time}`,
      shortText: `Cierra en ${moment.minutes} min`,
      emphasized: true,
    };
  }
  if (moment.dayDiff === 0) {
    return {
      text: `Cierra a las ${moment.time}`,
      shortText: `Cierra ${moment.time}`,
      emphasized: false,
    };
  }
  // Si cierra otro día se dice siempre, aunque el mockup muestre "Cierra a las 02:00" pasada la
  // medianoche: con turnos encadenados el cierre de mañana puede ser más tarde que la hora actual,
  // y sin "mañana" se leería como de hoy.
  if (moment.dayDiff === 1) {
    return {
      text: `Cierra mañana a las ${moment.time}`,
      shortText: `Cierra mañana ${moment.time}`,
      emphasized: false,
    };
  }
  return {
    text: `Cierra ${longDayWord(moment)} a las ${moment.time}`,
    shortText: `Cierra ${shortDayWord(moment)} ${moment.time}`,
    emphasized: false,
  };
}

function closedText(nextOpeningAt: string | null, now: Date, timeZone: string): StatusText | null {
  const moment = momentFrom(nextOpeningAt, now, timeZone);
  if (!moment) return null;

  if (moment.minutes <= SOON_MINUTES) {
    return {
      text: `Abre en ${moment.minutes} min · ${moment.time}`,
      shortText: `Abre en ${moment.minutes} min`,
      emphasized: true,
    };
  }
  if (moment.dayDiff === 0) {
    return {
      text: `Abre a las ${moment.time}`,
      shortText: `Abre ${moment.time}`,
      emphasized: false,
    };
  }
  if (moment.dayDiff === 1) {
    return {
      text: `Abre mañana a las ${moment.time}`,
      shortText: `Abre mañana ${moment.time}`,
      emphasized: false,
    };
  }
  return {
    text: `Abre ${longDayWord(moment)} a las ${moment.time}`,
    shortText: `Abre ${shortDayWord(moment)} ${moment.time}`,
    emphasized: false,
  };
}

// "Hoy no abre": la API salta el día de hoy al buscar la próxima apertura, así que siempre es de
// otro día. Por eso nunca se dice "en N min" ni va en negrita, aunque falte poco para la medianoche.
function closedTodayText(
  nextOpeningAt: string | null,
  now: Date,
  timeZone: string,
): StatusText | null {
  const moment = momentFrom(nextOpeningAt, now, timeZone);
  if (!moment) return null;

  // Un día 0 no debería llegar (ver arriba); si llega, no se dice "Hoy no abre" para no contradecir
  // la hora de hoy que sigue.
  if (moment.dayDiff === 0) {
    return {
      text: `Vuelve a las ${moment.time}`,
      shortText: `Vuelve ${moment.time}`,
      emphasized: false,
    };
  }
  if (moment.dayDiff === 1) {
    return {
      text: `Hoy no abre. Vuelve mañana a las ${moment.time}`,
      shortText: `Vuelve mañana ${moment.time}`,
      emphasized: false,
    };
  }
  return {
    text: `Hoy no abre. Vuelve ${longDayWord(moment)} a las ${moment.time}`,
    shortText: `Vuelve ${shortDayWord(moment)} ${moment.time}`,
    emphasized: false,
  };
}

// "el jueves" dentro de la semana; "el próximo jueves" desde los 7 días, para no confundirlo con
// el jueves de esta semana.
function longDayWord({ dayDiff, weekday }: Moment): string {
  return dayDiff >= 7 ? `el próximo ${weekday}` : `el ${weekday}`;
}

// La versión corta también lleva "próximo" desde los 7 días: sin él, "Abre martes 09:00" dicho un
// martes no aclara si es hoy o la semana que viene.
function shortDayWord({ dayDiff, weekday }: Moment): string {
  return dayDiff >= 7 ? `próximo ${weekday}` : weekday;
}

function momentFrom(iso: string | null, now: Date, timeZone: string): Moment | null {
  if (iso === null) return null;
  const instant = new Date(iso);
  if (Number.isNaN(instant.getTime())) return null;

  // Hacia arriba: con 30 segundos por delante se dice "en 1 min", nunca "en 0 min".
  const minutes = Math.ceil((instant.getTime() - now.getTime()) / MS_PER_MINUTE);
  if (minutes <= 0) return null;

  try {
    return {
      minutes,
      time: formatTime(instant, timeZone),
      dayDiff: localDayNumber(instant, timeZone) - localDayNumber(now, timeZone),
      weekday: formatWeekday(instant, timeZone),
    };
  } catch (error) {
    // Intl lanza RangeError con una zona que no conoce: sin esta línea la ficha se ve igual, pero
    // un error acá rompería la página entera (500). Cualquier otro error sí tiene que llegar.
    if (error instanceof RangeError) return null;
    throw error;
  }
}

// hourCycle h23 evita el "24:00" de la medianoche.
function formatTime(instant: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(instant);
}

function formatWeekday(instant: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('es-AR', { timeZone, weekday: 'long' })
    .format(instant)
    .toLowerCase();
}

// Número de día del calendario local (días desde 1970 según la fecha en la zona del negocio).
// La resta de dos de estos números da los días de diferencia sin que el huso ni el UTC se
// mezclen: la hora se descarta y Date.UTC solo sirve para contar días.
function localDayNumber(instant: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(instant);
  const part = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return Math.round(Date.UTC(part('year'), part('month') - 1, part('day')) / MS_PER_DAY);
}
