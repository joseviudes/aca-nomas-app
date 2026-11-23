import type { Category } from '../schemas/category-list.schema';

// El rubro que el filtro marca como elegido: el de la URL solo si está entre los rubros de la API.
// Un rubro bien escrito que no existe (?rubro=heladeria) se marca como "Todo", igual en las
// pestañas y en el desplegable, para que las dos vistas digan lo mismo. El listado igual muestra
// el estado vacío con "Ver todos", que es la salida en el celular: el desplegable ya está en
// "Todo" y elegirlo de nuevo no dispara un cambio.
export function activeCategory(categories: Category[], category?: string): string | undefined {
  return categories.some(({ slug }) => slug === category) ? category : undefined;
}
