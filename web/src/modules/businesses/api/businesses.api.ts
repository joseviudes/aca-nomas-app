import { businessListFixture } from './businesses.fixtures';
import { businessListResponseSchema } from '../schemas/business-list.schema';

// Datos de ejemplo hasta conectar con la API (D-40).
// No se manda limit: se usan los 20 por página que la API trae por defecto.
export async function listBusinesses({ page = 1 }: { page?: number } = {}) {
  return businessListResponseSchema.parse(businessListFixture({ page, limit: 20 }));
}
