import { z } from 'zod';

const DEV_API_URL = 'http://localhost:3000/api';

// Vite solo expone al navegador las variables que empiezan con VITE_. Nunca poner secretos acá:
// todo lo que se lee en este archivo termina dentro del JavaScript que descarga el usuario.
const envSchema = z.object({
  VITE_API_URL: z
    .url({ protocol: /^https?$/ })
    .optional()
    // En producción no hay valor por defecto: con localhost, el panel cargaría y ninguna llamada
    // funcionaría. Mejor que falle al abrir, con el motivo en la consola.
    .transform((url, ctx) => {
      const value = url ?? (import.meta.env.PROD ? undefined : DEV_API_URL);
      if (value === undefined) {
        ctx.addIssue({ code: 'custom', message: 'Es obligatoria en producción' });
        return z.NEVER;
      }
      // Sin "/" final, así las rutas se arman siempre como `${VITE_API_URL}/businesses`.
      return value.replace(/\/+$/, '');
    }),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const result = envSchema.safeParse(import.meta.env);
  if (!result.success) {
    throw new Error(`Variables de entorno inválidas:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

// Se valida al cargar la app: si la URL falta o está mal, falla enseguida y no en la primera llamada.
export const env = parseEnv();
