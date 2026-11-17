// Tipos del cálculo de "abierto ahora" (RN-01 a RN-04). No dependen de Prisma: el repositorio
// convierte las filas de la base a esta forma, con los mismos formatos que la API (docs/api.md).

// 1 es lunes y 7 es domingo, como `opening_hours.day_of_week`.
export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

// Un turno pertenece al día en que empieza. Las horas son locales de la localidad, en `HH:mm`.
// Inicio inclusive y fin exclusivo. Si el fin es menor o igual al inicio, cruza la medianoche (RN-02).
export interface Shift {
  dayOfWeek: DayOfWeek;
  opensAt: string;
  closesAt: string;
}

export interface OpeningHours {
  isPaused: boolean;
  // Fecha local `AAAA-MM-DD` en que el dueño marcó "hoy no abro". Vence sola al cambiar el día.
  closedTodayDate: string | null;
  shifts: Shift[];
}

// Cada estado trae solo el dato que corresponde (RN-04). Los momentos son exactos, no horas locales.
export type BusinessStatus =
  // `closesAt` es null si el negocio está abierto la semana entera, sin cerrar nunca.
  | { state: 'open'; closesAt: Date | null; nextOpeningAt: null }
  // `nextOpeningAt` es null si el negocio no tiene ningún turno cargado.
  | { state: 'closed' | 'closed_today'; closesAt: null; nextOpeningAt: Date | null }
  // Pausado no tiene próxima apertura: depende de cuándo lo reactive el dueño.
  | { state: 'paused'; closesAt: null; nextOpeningAt: null };

export type BusinessState = BusinessStatus['state'];
