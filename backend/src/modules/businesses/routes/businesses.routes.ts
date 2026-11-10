import { Router } from 'express';
import { validate } from '../../../shared/middlewares/validate.js';
import type { BusinessController } from '../controllers/business.controller.js';
import { businessListQuerySchema } from '../schemas/business.schema.js';

// Se monta en /businesses desde src/routes.ts (D-23). Documentado en businesses.openapi.ts (D-34).
export function createBusinessesRouter(controller: BusinessController): Router {
  const router = Router();

  // Público, sin sesión (US-01).
  router.get('/', validate({ query: businessListQuerySchema }), controller.list);

  return router;
}
