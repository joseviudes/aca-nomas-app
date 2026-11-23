import { http } from '@/shared/api/http-client';
import { businessDetailSchema } from '../schemas/business-detail.schema';
import { businessListResponseSchema } from '../schemas/business-list.schema';
import { categoryListResponseSchema } from '../schemas/category-list.schema';

// No se manda limit: se usan los 20 por página que la API trae por defecto. El rubro va solo si
// hay uno: sin category, la API devuelve todos los negocios.
// Sin caché: el estado de cada negocio (abierto, cerrado) cambia con la hora.
export function listBusinesses({ page = 1, category }: { page?: number; category?: string } = {}) {
  const query = new URLSearchParams({ page: String(page) });
  if (category) query.set('category', category);

  return http.get(`/businesses?${query}`, {
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

// Los rubros son una lista fija que se carga con el seed: se guardan una hora en la caché de Next
// en lugar de pedirlos en cada visita. limit=100 (el máximo de la API) trae todos en una página.
export function listCategories() {
  return http.get('/categories?limit=100', {
    schema: categoryListResponseSchema,
    next: { revalidate: 3600 },
  });
}
