import { prisma } from './infrastructure/database/prisma.js';
import { BusinessController } from './modules/businesses/controllers/business.controller.js';
import { PrismaBusinessRepository } from './modules/businesses/repositories/prisma-business.repository.js';
import { BusinessService } from './modules/businesses/services/business.service.js';
import { OpeningHoursService } from './modules/opening-hours/services/opening-hours.service.js';

// Raíz de composición (D-06): el único lugar que conoce las implementaciones concretas.
// Cada módulo se conecta acá por constructor, de abajo hacia arriba.
const openingHoursService = new OpeningHoursService();
const businessRepository = new PrismaBusinessRepository(prisma);
const businessService = new BusinessService(businessRepository, openingHoursService);

export const container = {
  businessController: new BusinessController(businessService),
};

export async function closeContainer(): Promise<void> {
  await prisma.$disconnect();
}
