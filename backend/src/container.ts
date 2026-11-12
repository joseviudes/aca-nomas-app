import { prisma } from './infrastructure/database/prisma.js';
import { AuthController } from './modules/auth/controllers/auth.controller.js';
import { PrismaUserRepository } from './modules/auth/repositories/prisma-user.repository.js';
import { AuthService } from './modules/auth/services/auth.service.js';

// Raíz de composición (D-06): el único lugar que conoce las implementaciones concretas.
const userRepository = new PrismaUserRepository(prisma);
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

export const container = { authController };

export async function closeContainer(): Promise<void> {
  await prisma.$disconnect();
}