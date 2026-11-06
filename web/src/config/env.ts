import { z } from 'zod';

const DEV_API_URL = 'http://localhost:3000/api';

// Las variables NEXT_PUBLIC_ llegan también al navegador: nunca poner secretos acá.
const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .url({ protocol: /^https?$/ })
    .optional()
    // En producción no hay valor por defecto: con localhost, la web compilaría y ninguna llamada
    // funcionaría. Mejor que falle el build, con el motivo en la salida.
    .transform((url, ctx) => {
      const value = url ?? (process.env.NODE_ENV === 'production' ? undefined : DEV_API_URL);
      if (value === undefined) {
        ctx.addIssue({ code: 'custom', message: 'Es obligatoria en producción' });
        return z.NEVER;
      }
      // Sin "/" final, así las rutas se arman siempre como `${NEXT_PUBLIC_API_URL}/businesses`.
      return value.replace(/\/+$/, '');
    }),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  // Next reemplaza `process.env.NEXT_PUBLIC_API_URL` por su valor al compilar, pero solo si se
  // escribe así, completo. Pasar `process.env` entero dejaría la variable vacía en el navegador.
  const result = envSchema.safeParse({ NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL });
  if (!result.success) {
    throw new Error(`Variables de entorno inválidas:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export const env = parseEnv();
