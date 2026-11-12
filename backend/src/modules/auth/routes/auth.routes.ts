import { Router } from 'express';
import { validate } from '../../../shared/middlewares/validate.js';
import type { AuthController } from '../controllers/auth.controller.js';
import { registerBodySchema } from '../schemas/auth.schema.js';

export function createAuthRouter(controller: AuthController): Router {
  const router = Router();

  router.post('/register', validate({ body: registerBodySchema }), controller.register);

  return router;
}