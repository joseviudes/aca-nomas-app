import { ApiError } from '@/shared/api/api-error';
import { http } from '@/shared/api/http-client';
import { businessDetailSchema } from '../schemas/business-detail.schema';
import { businessListResponseSchema } from '../schemas/business-list.schema';
import { businessDetailFixture } from './business-detail.fixtures';

// No se manda limit: se usan los 20 por página que la API trae por defecto.
// Sin caché: el estado de cada negocio (abierto, cerrado) cambia con la hora.
export function listBusinesses({ page = 1 }: { page?: number } = {}) {
  return http.get(`/businesses?page=${page}`, {
    schema: businessListResponseSchema,
    cache: 'no-store',
  });
}

// Datos de ejemplo hasta conectar con la API (D-40). Imita el 404 del contrato, así la página ya
// trata el negocio que no existe igual que después.
export async function getBusiness(slug: string) {
  const fixture = businessDetailFixture(slug);
  if (!fixture) {
    throw new ApiError(404, 'BUSINESS_NOT_FOUND', 'No se encontró el negocio');
  }
  return businessDetailSchema.parse(fixture);
}
