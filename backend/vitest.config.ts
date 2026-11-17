import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    // La misma configuración que usa la API: mensajes de Zod en español (src/config/zod.ts)
    // y Luxon (src/config/luxon.ts, importado desde src/server.ts).
    setupFiles: ['./src/config/zod.ts', './src/config/luxon.ts'],
    // config/env.ts valida al importarse. Las pruebas unitarias no se conectan a esta base.
    env: {
      DATABASE_URL: 'postgresql://test:test@localhost:5432/aca_nomas_test',
    },
  },
});
