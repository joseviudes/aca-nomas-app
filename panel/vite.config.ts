import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  // Tailwind CSS 4 en Vite se carga como plugin (D-38).
  plugins: [react(), tailwindcss()],
  server: {
    port: 3002,
  },
});
