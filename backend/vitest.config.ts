import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    // La misma configuración de Luxon que usa el servidor (src/server.ts).
    setupFiles: ['./src/config/luxon.ts'],
    // config/env.ts valida al importarse. Las pruebas unitarias no se conectan a esta base.
    env: {
      DATABASE_URL: 'postgresql://test:test@localhost:5432/aca_nomas_test',
    },
  },
});
