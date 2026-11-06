import { z } from 'zod';

// Vite solo expone al navegador las variables que empiezan con VITE_. Nunca poner secretos acá:
// todo lo que se lee en este archivo termina dentro del JavaScript que descarga el usuario.
const envSchema = z.object({
  VITE_API_URL: z
    .url({ protocol: /^https?$/ })
    .default('http://localhost:3000/api')
    // Sin "/" final, así las rutas se arman siempre como `${VITE_API_URL}/businesses`.
    .transform((url) => url.replace(/\/+$/, '')),
});

export type Env = z.infer<typeof envSchema>;

// Se valida al cargar la app: si la URL está mal, falla enseguida y no en la primera llamada.
export const env = envSchema.parse(import.meta.env);
