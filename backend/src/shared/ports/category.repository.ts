import type { PaginationQuery } from '../pagination/pagination.js';

// Un rubro tal como está guardado. Es la misma forma que sale en la API.
export interface CategoryEntry {
  slug: string;
  name: string;
}

export interface CategoryPage {
  items: CategoryEntry[];
  // Todos los rubros cargados, no solo los de esta página (D-25).
  total: number;
}

export interface CategoryRepository {
  // Ordenados por nombre. Una página fuera de rango devuelve items vacío, no un error.
  findPage(pagination: PaginationQuery): Promise<CategoryPage>;
}
