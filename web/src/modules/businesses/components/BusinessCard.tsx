import Link from 'next/link';
import { businessDetailPath, businessInitial } from '../domain/business-display';
import type { BusinessListItem } from '../schemas/business-list.schema';
import { BusinessStatusBadge } from './BusinessStatusBadge';

// Negocio del listado (US-01). En el celular es una fila con la miniatura al costado; desde sm,
// una tarjeta con la foto cuadrada arriba (mockup). Toda la tarjeta es el enlace a la ficha (US-08).
export function BusinessCard({ business }: { business: BusinessListItem }) {
  return (
    <article>
      <Link
        href={businessDetailPath(business.slug)}
        className="flex items-center gap-3.5 border-b border-mint py-3.5 sm:flex-col sm:items-stretch sm:gap-0 sm:border-b-0 sm:py-0"
      >
        {/* Hasta US-19 no hay fotos: el lugar de la foto queda en mint con la inicial (docs/diseno.md, sección 4). */}
        <div className="relative flex size-23 shrink-0 items-center justify-center rounded-card bg-mint sm:aspect-square sm:size-auto sm:w-full">
          <span aria-hidden="true" className="font-display text-5xl text-brand sm:text-8xl">
            {businessInitial(business.name)}
          </span>
          <span className="caps-label absolute bottom-3.5 left-4 hidden text-brand sm:block">
            Sin foto
          </span>
          <div className="absolute top-3.5 left-3.5 hidden sm:block">
            <BusinessStatusBadge state={business.status.state} />
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 break-words sm:pt-4">
          <h3 className="text-base leading-tight font-bold sm:text-lg">{business.name}</h3>
          <p className="text-sm text-muted">{business.category.name}</p>
          <div className="sm:hidden">
            <BusinessStatusBadge state={business.status.state} />
          </div>
          {/* En el celular no hay "Ver ficha": toda la fila es el enlace (docs/mockup/web.md). */}
          <span aria-hidden="true" className="hidden text-sm font-bold text-brand sm:block">
            Ver ficha →
          </span>
        </div>
      </Link>
    </article>
  );
}
