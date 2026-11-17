import { z } from 'zod';

// Los mensajes de Zod llegan al cliente en el details de VALIDATION_ERROR, y los mensajes de la API
// van en español (docs/api.md). z.config es global: app.ts lo importa antes que cualquier esquema, y
// Vitest lo carga en setupFiles para que las pruebas vean los mismos mensajes que la API.
// Un esquema puede traer su propio mensaje cuando el del locale no se entiende bien.
z.config(z.locales.es());
