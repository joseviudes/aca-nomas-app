import type { PaginationQuery } from '../pagination/pagination.js';

// Lo que el listado necesita de cada negocio guardado. Es el dato tal como está en la base: la
// clave de la foto, no la URL (D-14), y la pausa, no el estado calculado (D-22).
export interface BusinessListEntry {
  slug: string;
  name: string;
  photoKey: string | null;
  isPaused: boolean;
  category: { slug: string; name: string };
}

export interface BusinessListPage {
  items: BusinessListEntry[];
  // Todos los negocios que cumplen los filtros, no solo los de esta página (D-25).
  total: number;
}

export interface BusinessRepository {
  // Ordenados por nombre. Una página fuera de rango devuelve items vacío, no un error.
  findPage(pagination: PaginationQuery): Promise<BusinessListPage>;
}
