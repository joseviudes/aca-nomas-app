import { createApp } from './app.js';

// Provisorio hasta config/env.ts: ahí el puerto se valida con Zod.
const port = Number(process.env.PORT ?? 3000);

const app = createApp();

app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
