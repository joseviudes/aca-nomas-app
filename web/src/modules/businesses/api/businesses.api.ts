import { http } from '@/shared/api/http-client';
import { businessDetailSchema } from '../schemas/business-detail.schema';
import { businessListResponseSchema } from '../schemas/business-list.schema';
import { categoryListResponseSchema } from '../schemas/category-list.schema';
import { categoryListFixture } from './businesses.fixtures';

// No se manda limit: se usan los 20 por página que la API trae por defecto.
// Sin caché: el estado de cada negocio (abierto, cerrado) cambia con la hora.
export function listBusinesses({ page = 1 }: { page?: number } = {}) {
  return http.get(`/businesses?page=${page}`, {
    schema: businessListResponseSchema,
    cache: 'no-store',
  });
}

// Si el negocio no existe, la API responde 404 y el http-client lanza BUSINESS_NOT_FOUND.
// Se codifica el slug para que un carácter raro no pida otra ruta. Sin caché, como el listado:
// con US-09 la ficha suma el estado, que cambia con la hora.
export function getBusiness(slug: string) {
  return http.get(`/businesses/${encodeURIComponent(slug)}`, {
    schema: businessDetailSchema,
    cache: 'no-store',
  });
}

// Datos de ejemplo hasta conectar con la API (D-40).
export async function listCategories() {
  return categoryListResponseSchema.parse(categoryListFixture());
}
