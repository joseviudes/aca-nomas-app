import type { Request, Response } from 'express';
import type { RegisterBody } from '../schemas/auth.schema.js';
import type { AuthService } from '../services/auth.service.js';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Express 5 manda a errorHandler cualquier error de una función async, sin try/catch.
  register = async (req: Request, res: Response): Promise<void> => {
    const user = await this.authService.register(req.body as RegisterBody);
    res.status(201).json(user);
  };
}