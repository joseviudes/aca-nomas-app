import { http } from '@/shared/api/http-client';
import { businessDetailSchema } from '../schemas/business-detail.schema';
import { businessListResponseSchema } from '../schemas/business-list.schema';
import { categoryListResponseSchema } from '../schemas/category-list.schema';
import { businessListFixture, categoryListFixture } from './businesses.fixtures';

// No se manda limit: se usan los 20 por página que la API trae por defecto.
// Sin caché: el estado de cada negocio (abierto, cerrado) cambia con la hora.
export async function listBusinesses({
  page = 1,
  category,
}: { page?: number; category?: string } = {}) {
  // Datos de ejemplo para el filtro por rubro hasta conectarlo con la API (D-40).
  if (category) {
    return businessListResponseSchema.parse(businessListFixture({ page, limit: 20, category }));
  }

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
