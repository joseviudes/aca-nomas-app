import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    // config/env.ts valida al importarse. Las pruebas unitarias no se conectan a esta base.
    env: {
      DATABASE_URL: 'postgresql://test:test@localhost:5432/aca_nomas_test',
    },
  },
});
