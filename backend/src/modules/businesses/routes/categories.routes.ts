import { Router } from 'express';
import { validate } from '../../../shared/middlewares/validate.js';
import type { CategoryController } from '../controllers/category.controller.js';
import { categoryListQuerySchema } from '../schemas/category.schema.js';

// Se monta en /categories desde src/routes.ts (D-23). Documentado en categories.openapi.ts (D-34).
export function createCategoriesRouter(controller: CategoryController): Router {
  const router = Router();

  // Público, sin sesión (US-03).
  router.get('/', validate({ query: categoryListQuerySchema }), controller.list);

  return router;
}
