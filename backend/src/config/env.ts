import { z } from 'zod';

// La web pública (3001) y el panel (3002). Solo fuera de producción (D-28).
const DEV_CORS_ORIGINS = 'http://localhost:3001,http://localhost:3002';

// Lista separada por comas. Se guarda solo el origen (sin "/" final) porque así lo manda el navegador.
const corsOriginsSchema = z
  .string()
  .transform((value) =>
    value
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  )
  .pipe(z.array(z.url({ protocol: /^https?$/ })).min(1))
  .transform((origins) => origins.map((origin) => new URL(origin).origin));

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
    CORS_ORIGINS: z.string().optional(),
  })
  // En producción no hay valor por defecto: si falta, el servidor no arranca. Con un default,
  // la API arrancaría aceptando solo localhost y la web fallaría sin que nada lo avise.
  .transform((env, ctx) => {
    const raw = env.CORS_ORIGINS ?? (env.NODE_ENV === 'production' ? undefined : DEV_CORS_ORIGINS);
    if (raw === undefined) {
      ctx.addIssue({
        code: 'custom',
        path: ['CORS_ORIGINS'],
        message: 'Es obligatoria en producción',
      });
      return z.NEVER;
    }

    const origins = corsOriginsSchema.safeParse(raw);
    if (!origins.success) {
      for (const issue of origins.error.issues) {
        ctx.addIssue({ code: 'custom', path: ['CORS_ORIGINS'], message: issue.message });
      }
      return z.NEVER;
    }
    return { ...env, CORS_ORIGINS: origins.data };
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
