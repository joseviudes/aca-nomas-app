import type { BusinessListItem } from '../schemas/business-list.schema';
import { BusinessCard } from './BusinessCard';

// En el celular, filas separadas por una línea (sin espacio entre ellas); desde sm, una grilla
// de tarjetas de dos, tres y cuatro columnas (docs/diseno.md, sección 9).
export const BUSINESS_GRID_CLASSES =
  'grid grid-cols-1 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4';

export function BusinessList({ businesses }: { businesses: BusinessListItem[] }) {
  return (
    <ul className={BUSINESS_GRID_CLASSES}>
      {businesses.map((business) => (
        <li key={business.slug}>
          <BusinessCard business={business} />
        </li>
      ))}
    </ul>
  );
}
