import type { OpeningHours } from '../../modules/opening-hours/domain/opening-hours.types.js';
import type { PaginationQuery } from '../pagination/pagination.js';

// Lo que el listado necesita de cada negocio guardado. Es el dato tal como está en la base: la
// clave de la foto, no la URL (D-14), y el horario, no el estado calculado (D-22).
export interface BusinessListEntry {
  slug: string;
  name: string;
  photoKey: string | null;
  category: { slug: string; name: string };
  // Pausa, "hoy no abro" y turnos, en la forma que recibe isOpenNow (horas `HH:mm`, fecha `AAAA-MM-DD`).
  openingHours: OpeningHours;
  // Zona horaria IANA de la localidad del negocio (D-12).
  timezone: string;
}

export interface BusinessListPage {
  items: BusinessListEntry[];
  // Todos los negocios que cumplen los filtros, no solo los de esta página (D-25).
  total: number;
}

// Lo que la ficha (US-08) necesita del negocio guardado. Como en el listado, la clave de la foto y
// no la URL (D-14). Con el horario, no el estado calculado (D-22), igual que el listado (US-09).
// Los canales y los pagos se suman con US-10 y US-17.
export interface BusinessDetailEntry {
  slug: string;
  name: string;
  description: string | null;
  photoKey: string | null;
  category: { slug: string; name: string };
  // Pausa, "hoy no abro" y turnos, en la forma que recibe isOpenNow.
  openingHours: OpeningHours;
  // Zona horaria IANA de la localidad del negocio (D-12).
  timezone: string;
}

export interface BusinessRepository {
  // Ordenados por nombre. Una página fuera de rango devuelve items vacío, no un error.
  findPage(pagination: PaginationQuery): Promise<BusinessListPage>;
  // null si ningún negocio tiene ese slug.
  findBySlug(slug: string): Promise<BusinessDetailEntry | null>;
}
