import { z } from 'zod';
import { businessStatusSchema } from './business-list.schema';

// Copia de la respuesta de GET /businesses/:slug (backend/src/modules/businesses/schemas/business.schema.ts).
// Si el backend cambia la forma, se cambia acá en el mismo PR: el http-client falla con
// INVALID_RESPONSE si no coinciden. Sin .strict(): los campos que sumen US-10 y US-17 se
// descartan hasta que la web los use, en lugar de romper la ficha.

// Hora local de la localidad en HH:mm (D-11). Un turno cuyo fin es menor o igual al inicio cruza
// la medianoche (RN-02) y queda en el día en que empieza: 19:00–01:00 es del día de las 19:00.
const localTimeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);

export const shiftSchema = z.object({ opensAt: localTimeSchema, closesAt: localTimeSchema });

export type Shift = z.infer<typeof shiftSchema>;

export const dayScheduleSchema = z.object({
  // 1 es lunes y 7 es domingo, como en la base.
  dayOfWeek: z.number().int().min(1).max(7),
  // Ordenados por hora de inicio. Vacío si ese día no abre.
  shifts: z.array(shiftSchema),
});

export type DaySchedule = z.infer<typeof dayScheduleSchema>;

// Horario de la semana en horas locales, no UTC. "Hoy" lo dice la API (today) con el reloj de la
// localidad: con el del navegador, un visitante de otra zona vería resaltado otro día.
export const weeklyScheduleSchema = z.object({
  timezone: z.string(),
  today: z.number().int().min(1).max(7),
  // Siempre 7 días, de lunes a domingo, aunque no tengan turnos.
  days: z.array(dayScheduleSchema).length(7),
});

export type WeeklySchedule = z.infer<typeof weeklyScheduleSchema>;

export const businessDetailSchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string().max(80).nullable(),
  category: z.object({ slug: z.string(), name: z.string() }),
  // Hasta US-19 no hay fotos: viene siempre en null.
  photoUrl: z.url().nullable(),
  // El mismo estado que el listado (RN-01): lo calcula la API y la web solo lo muestra.
  status: businessStatusSchema,
  schedule: weeklyScheduleSchema,
});

export type BusinessDetail = z.infer<typeof businessDetailSchema>;
