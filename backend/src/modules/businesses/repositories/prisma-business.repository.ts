import type { PrismaClient } from '../../../generated/prisma/client.js';
import { toOffset, type PaginationQuery } from '../../../shared/pagination/pagination.js';
import type {
  BusinessListPage,
  BusinessRepository,
} from '../../../shared/ports/business.repository.js';

export class PrismaBusinessRepository implements BusinessRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findPage(pagination: PaginationQuery): Promise<BusinessListPage> {
    // En una transacción, para que el total y la página se lean de la misma foto de la base.
    const [items, total] = await this.prisma.$transaction([
      this.prisma.business.findMany({
        select: {
          slug: true,
          name: true,
          photoKey: true,
          isPaused: true,
          category: { select: { slug: true, name: true } },
        },
        // RF-05: sin ubicación del visitante, el orden es por nombre. El slug es único y desempata
        // dos negocios con el mismo nombre, así ninguno se repite ni se pierde entre páginas.
        // "Abiertos primero" se suma cuando exista isOpenNow (HT-01).
        orderBy: [{ name: 'asc' }, { slug: 'asc' }],
        skip: toOffset(pagination),
        take: pagination.limit,
      }),
      this.prisma.business.count(),
    ]);

    return { items, total };
  }
}
