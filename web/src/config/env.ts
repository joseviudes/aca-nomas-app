import { z } from 'zod';

const DEV_API_URL = 'http://localhost:3000/api';

// Las variables NEXT_PUBLIC_ llegan también al navegador: nunca poner secretos acá.
function createEnvSchema(isProduction: boolean) {
  return z.object({
    NEXT_PUBLIC_API_URL: z
      .url({ protocol: /^https?$/ })
      .optional()
      // En producción no hay valor por defecto: con localhost, la web compilaría y ninguna llamada
      // funcionaría. Mejor que falle el build, con el motivo en la salida.
      .transform((url, ctx) => {
        const value = url ?? (isProduction ? undefined : DEV_API_URL);
        if (value === undefined) {
          ctx.addIssue({ code: 'custom', message: 'Es obligatoria en producción' });
          return z.NEVER;
        }
        // Sin "/" final, así las rutas se arman siempre como `${NEXT_PUBLIC_API_URL}/businesses`.
        return value.replace(/\/+$/, '');
      }),
    // Solo del servidor (sin NEXT_PUBLIC_, no llega al navegador). Es la dirección de la API vista
    // desde el servidor de Next, cuando no es la misma que ve el navegador: en Docker,
    // `localhost` es el propio contenedor y la API está en `http://api:3000/api` (D-33).
    // Si no se define, el servidor usa NEXT_PUBLIC_API_URL.
    API_INTERNAL_URL: z
      .url({ protocol: /^https?$/ })
      .optional()
      .transform((url) => url?.replace(/\/+$/, '')),
  });
}

export type Env = z.infer<ReturnType<typeof createEnvSchema>>;

// Recibe el origen y el modo por parámetro para poder probarla sin tocar process.env.
export function parseEnv(source: Record<string, unknown>, isProduction: boolean): Env {
  const result = createEnvSchema(isProduction).safeParse(source);
  if (!result.success) {
    throw new Error(`Variables de entorno inválidas:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

// Next reemplaza `process.env.NEXT_PUBLIC_API_URL` por su valor al compilar, pero solo si se escribe
// así, completo. Pasar `process.env` entero dejaría la variable vacía en el navegador.
export const env = parseEnv(
  {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    API_INTERNAL_URL: process.env.API_INTERNAL_URL,
  },
  process.env.NODE_ENV === 'production',
);
