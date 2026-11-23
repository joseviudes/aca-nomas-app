import { cacheLife } from 'next/cache';
import { ApiError } from '@/shared/api/api-error';
import { http } from '@/shared/api/http-client';
import { businessDetailSchema } from '../schemas/business-detail.schema';
import { businessListResponseSchema } from '../schemas/business-list.schema';
import {
  categoryListResponseSchema,
  type CategoryListResponse,
} from '../schemas/category-list.schema';

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

// Los rubros son una lista fija que se carga con el seed: se guardan en la caché de Next en lugar
// de pedirlos en cada visita. limit=100 (el máximo de la API) trae todos en una página. Al no
// depender de la URL, entran en la parte estática de la página.
export async function listCategories(): Promise<CategoryListResponse> {
  const result = await fetchCategoriesCached();
  if (!result.ok) throw new ApiError(result.status, result.code, result.message);
  return result.response;
}

type CachedCategories =
  | { ok: true; response: CategoryListResponse }
  | { ok: false; status: number; code: string; message: string };

// Con cacheComponents la caché se declara con 'use cache' y su duración con cacheLife (D-50). Por
// eso el fetch no lleva next.revalidate: serían dos duraciones para lo mismo.
// - Si responde, 'hours': se renueva cada hora.
// - Si falla, el fallo no tiene que quedar en la parte estática de la página. Se devuelve con
//   'seconds', que Next deja fuera de esa parte: dura como mucho un minuto y después se vuelve a
//   pedir. listCategories lo relanza como ApiError. No se lanza el error acá adentro porque, con
//   la API apagada, un ApiError lanzado dentro de 'use cache' hizo fallar el armado de "/" en
//   next build y el build terminó con error.
async function fetchCategoriesCached(): Promise<CachedCategories> {
  'use cache';

  try {
    const response = await http.get('/categories?limit=100', {
      schema: categoryListResponseSchema,
    });
    cacheLife('hours');
    return { ok: true, response };
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;

    cacheLife('seconds');
    return { ok: false, status: error.status, code: error.code, message: error.message };
  }
}
