import { prisma } from './infrastructure/database/prisma.js';
import { BusinessController } from './modules/businesses/controllers/business.controller.js';
import { CategoryController } from './modules/businesses/controllers/category.controller.js';
import { PrismaBusinessRepository } from './modules/businesses/repositories/prisma-business.repository.js';
import { PrismaCategoryRepository } from './modules/businesses/repositories/prisma-category.repository.js';
import { BusinessService } from './modules/businesses/services/business.service.js';
import { CategoryService } from './modules/businesses/services/category.service.js';
import { OpeningHoursService } from './modules/opening-hours/services/opening-hours.service.js';

// Raíz de composición (D-06): el único lugar que conoce las implementaciones concretas.
// Cada módulo se conecta acá por constructor, de abajo hacia arriba.
const openingHoursService = new OpeningHoursService();
const businessRepository = new PrismaBusinessRepository(prisma);
const businessService = new BusinessService(businessRepository, openingHoursService);
const categoryRepository = new PrismaCategoryRepository(prisma);
const categoryService = new CategoryService(categoryRepository);

export const container = {
  businessController: new BusinessController(businessService),
  categoryController: new CategoryController(categoryService),
};

export async function closeContainer(): Promise<void> {
  await prisma.$disconnect();
}
