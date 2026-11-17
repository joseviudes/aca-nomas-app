import { Card } from '@/shared/ui/Card';
import type { BusinessListItem } from '../schemas/business-list.schema';
import { BusinessStatusBadge } from './BusinessStatusBadge';

// Tarjeta del listado (US-01). El enlace a la ficha se suma con US-08, cuando exista la página.
export function BusinessCard({ business }: { business: BusinessListItem }) {
  return (
    <Card as="article" className="flex h-full flex-col gap-4">
      {/* Hasta US-19 no hay fotos: el lugar de la foto queda en mint (docs/diseno.md, sección 4). */}
      <div aria-hidden="true" className="aspect-video w-full rounded-field bg-mint" />
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold">{business.name}</h2>
        <p className="font-display text-base text-muted">{business.category.name}</p>
      </div>
      <div className="mt-auto">
        <BusinessStatusBadge state={business.status.state} />
      </div>
    </Card>
  );
}
