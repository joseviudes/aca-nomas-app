import type { BusinessListItem } from '../schemas/business-list.schema';
import { BusinessCard } from './BusinessCard';

// Una columna en el celular, dos en tablet y tres en escritorio (docs/diseno.md, sección 9).
export function BusinessList({ businesses }: { businesses: BusinessListItem[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {businesses.map((business) => (
        <li key={business.slug}>
          <BusinessCard business={business} />
        </li>
      ))}
    </ul>
  );
}
