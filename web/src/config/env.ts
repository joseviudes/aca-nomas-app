import { z } from 'zod';

// Las variables NEXT_PUBLIC_ llegan también al navegador: nunca poner secretos acá.
const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .url({ protocol: /^https?$/ })
    .default('http://localhost:3000/api')
    // Sin "/" final, así las rutas se arman siempre como `${NEXT_PUBLIC_API_URL}/businesses`.
    .transform((url) => url.replace(/\/+$/, '')),
});

export type Env = z.infer<typeof envSchema>;

// Next reemplaza `process.env.NEXT_PUBLIC_API_URL` por su valor al compilar, pero solo si se escribe
// así, completo. Pasar `process.env` entero dejaría la variable vacía en el navegador.
export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});
