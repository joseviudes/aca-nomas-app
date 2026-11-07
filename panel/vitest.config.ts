import { defineConfig } from 'vitest/config';

// Mismo criterio que el backend: las pruebas van en tests/, replicando la ruta de src/.
export default defineConfig({
  test: {
    include: ['tests/**/*.test.{ts,tsx}'],
    // Por ahora solo se prueba lógica sin pantalla (http-client, env). Cuando haya componentes,
    // se suma un entorno de navegador (jsdom) para esas pruebas.
    environment: 'node',
  },
});
