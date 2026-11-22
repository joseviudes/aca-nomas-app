import type { PrismaClient } from '../../../generated/prisma/client.js';
import { toOffset, type PaginationQuery } from '../../../shared/pagination/pagination.js';
import type {
  CategoryPage,
  CategoryRepository,
} from '../../../shared/ports/category.repository.js';

export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findPage(pagination: PaginationQuery): Promise<CategoryPage> {
    // En una transacción, para que el total y la página se lean de la misma foto de la base.
    const [items, total] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        select: { slug: true, name: true },
        // El nombre es único, así que el orden es estable entre páginas.
        orderBy: { name: 'asc' },
        skip: toOffset(pagination),
        take: pagination.limit,
      }),
      this.prisma.category.count(),
    ]);

    return { items, total };
  }
}
