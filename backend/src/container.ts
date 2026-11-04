import { prisma } from './infrastructure/database/prisma.js';

// Raíz de composición (D-06): el único lugar que conoce las implementaciones concretas.
// Cada módulo se conecta acá por constructor, de abajo hacia arriba. Por ejemplo:
//   const businessRepository = new PrismaBusinessRepository(prisma);
//   const businessService = new BusinessService(businessRepository);
//   const businessController = new BusinessController(businessService);
export const container = {};

export async function closeContainer(): Promise<void> {
  await prisma.$disconnect();
}
