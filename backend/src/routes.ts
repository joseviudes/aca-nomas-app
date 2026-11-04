import { Router } from 'express';

// Registro central de rutas (D-23): cada módulo suma su router acá y app.ts lo monta bajo /api.
export function createApiRouter(): Router {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  return router;
}
