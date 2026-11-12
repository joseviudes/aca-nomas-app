import { z } from 'zod';

// Cuerpo de POST /api/auth/register (US-12).
export const registerBodySchema = z.object({
  // Se guarda siempre en minúsculas (lo pide el modelo User de schema.prisma).
  email: z.email().toLowerCase().meta({ example: 'duena@ejemplo.com' }),
  // bcrypt ignora lo que pase de 72 bytes, por eso el tope.
  password: z.string().min(8).max(72).meta({ example: 'una-clave-segura' }),
});

// Respuesta 201. Nunca incluye passwordHash ni tokens (docs/api.md).
export const registerResponseSchema = z.object({
  id: z.string().meta({ example: 'b3f1c2d4-0000-4000-8000-000000000000' }),
  email: z.email().meta({ example: 'duena@ejemplo.com' }),
});

export type RegisterBody = z.infer<typeof registerBodySchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;