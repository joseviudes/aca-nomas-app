import { http } from '@/shared/api/http-client';
import { businessListResponseSchema } from '../schemas/business-list.schema';

// No se manda limit: se usan los 20 por página que la API trae por defecto.
// Sin caché: el estado de cada negocio (abierto, cerrado) cambia con la hora.
export function listBusinesses({ page = 1 }: { page?: number } = {}) {
  return http.get(`/businesses?page=${page}`, {
    schema: businessListResponseSchema,
    cache: 'no-store',
  });
}
