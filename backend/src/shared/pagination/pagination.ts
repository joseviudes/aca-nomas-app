import { z } from 'zod';

export const DEFAULT_PAGE_SIZE = 20;
// Tope para que nadie pida la base entera en una sola request. A confirmar en el diseño de la API (D-20).
export const MAX_PAGE_SIZE = 100;

// Cada módulo lo extiende con sus filtros: paginationQuerySchema.extend({ category: ... }).
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export interface Page<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

// Cuántos registros saltear. El repositorio lo traduce a su tecnología (en Prisma, skip y take).
export function toOffset({ page, limit }: PaginationQuery): number {
  return (page - 1) * limit;
}

export function toPage<T>(data: T[], total: number, { page, limit }: PaginationQuery): Page<T> {
  return { data, page, limit, total };
}
