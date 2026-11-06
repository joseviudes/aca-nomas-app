import { z } from 'zod';

// La web pública (3001) y el panel (3002) en desarrollo (D-28).
const DEFAULT_CORS_ORIGINS = 'http://localhost:3001,http://localhost:3002';

// Lista separada por comas. Se guarda solo el origen (sin "/" final) porque así lo manda el navegador.
const corsOriginsSchema = z
  .string()
  .default(DEFAULT_CORS_ORIGINS)
  .transform((value) =>
    value
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  )
  .pipe(z.array(z.url({ protocol: /^https?$/ })).min(1))
  .transform((origins) => origins.map((origin) => new URL(origin).origin));

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
  CORS_ORIGINS: corsOriginsSchema,
});

export type Env = z.infer<typeof envSchema>;

export class EnvValidationError extends Error {
  constructor(details: string) {
    super(`Variables de entorno inválidas:\n${details}`);
    this.name = 'EnvValidationError';
  }
}

// Recibe el origen por parámetro para poder probarla sin tocar process.env.
export function parseEnv(source: NodeJS.ProcessEnv): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    throw new EnvValidationError(z.prettifyError(result.error));
  }
  return result.data;
}

// Se valida al importar: si falta o está mal una variable, el servidor no arranca.
export const env = parseEnv(process.env);
