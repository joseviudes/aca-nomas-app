import { z } from 'zod';
import { MAX_PAGE_SIZE, paginationQuerySchema } from '../../../shared/pagination/pagination.js';

// Un rubro, tal como lo muestra el selector del listado (US-03). El slug es el valor que se manda
// como ?category= a GET /api/businesses; el name es lo que ve el visitante.
export const categorySchema = z
  .object({
    slug: z.string(),
    name: z.string(),
  })
  .meta({ id: 'Category' });

export type Category = z.infer<typeof categorySchema>;

// Los rubros son una lista fija cargada con el seed, pero igual salen paginados: toda lista de la
// API lo es (D-25). Con 20 por página por defecto entran todos en la primera.
export const categoryListQuerySchema = paginationQuerySchema;

export type CategoryListQuery = z.infer<typeof categoryListQuerySchema>;

export const categoryListResponseSchema = z
  .object({
    data: z.array(categorySchema),
    page: z.number().int().min(1),
    limit: z.number().int().min(1).max(MAX_PAGE_SIZE),
    total: z.number().int().min(0).meta({ description: 'Rubros que hay cargados' }),
  })
  .meta({
    id: 'CategoryListResponse',
    // Lo que devuelve ?limit=3 con el seed: ordenados por nombre.
    example: {
      data: [
        { slug: 'almacen', name: 'Almacén' },
        { slug: 'bicicleteria', name: 'Bicicletería' },
        { slug: 'cafeteria', name: 'Cafetería' },
      ],
      page: 1,
      limit: 3,
      total: 10,
    },
  });

export type CategoryListResponse = z.infer<typeof categoryListResponseSchema>;
