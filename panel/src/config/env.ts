import { z } from 'zod';

const DEV_API_URL = 'http://localhost:3000/api';

// Vite solo expone al navegador las variables que empiezan con VITE_. Nunca poner secretos acá:
// todo lo que se lee en este archivo termina dentro del JavaScript que descarga el usuario.
function createEnvSchema(isProduction: boolean) {
  return z.object({
    VITE_API_URL: z
      .url({ protocol: /^https?$/ })
      .optional()
      // En producción no hay valor por defecto: con localhost, el panel cargaría y ninguna llamada
      // funcionaría. Mejor que falle al abrir, con el motivo en la consola.
      .transform((url, ctx) => {
        const value = url ?? (isProduction ? undefined : DEV_API_URL);
        if (value === undefined) {
          ctx.addIssue({ code: 'custom', message: 'Es obligatoria en producción' });
          return z.NEVER;
        }
        // Sin "/" final, así las rutas se arman siempre como `${VITE_API_URL}/businesses`.
        return value.replace(/\/+$/, '');
      }),
  });
}

export type Env = z.infer<ReturnType<typeof createEnvSchema>>;

// Recibe el origen y el modo por parámetro para poder probarla sin tocar import.meta.env.
export function parseEnv(source: Record<string, unknown>, isProduction: boolean): Env {
  const result = createEnvSchema(isProduction).safeParse(source);
  if (!result.success) {
    throw new Error(`Variables de entorno inválidas:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

// Se valida al cargar la app: si la URL falta o está mal, falla enseguida y no en la primera llamada.
export const env = parseEnv(import.meta.env, import.meta.env.PROD);
