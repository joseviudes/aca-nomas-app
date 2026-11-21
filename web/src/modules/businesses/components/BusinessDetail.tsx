import { Card } from '@/shared/ui/Card';
import { businessInitial } from '../domain/business-display';
import type { BusinessDetail as BusinessDetailData } from '../schemas/business-detail.schema';

// Ficha pública (US-08). En el celular, una columna; desde lg, la foto y los datos lado a lado.
// Estado, horario, contacto y pagos se suman con US-09, US-10 y US-17 (docs/mockup/web.md).
export function BusinessDetail({ business }: { business: BusinessDetailData }) {
  return (
    <Card
      as="article"
      tone="sand"
      className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8"
    >
      {/* Hasta US-19 no hay fotos: el lugar de la foto queda en mint con la inicial (docs/diseno.md, sección 4). */}
      <div className="relative flex aspect-[4/3] w-full shrink-0 items-center justify-center rounded-card bg-mint lg:w-1/2">
        <span aria-hidden="true" className="font-display text-8xl text-brand">
          {businessInitial(business.name)}
        </span>
        <span className="caps-label absolute bottom-3.5 left-4 text-brand">Sin foto</span>
      </div>
      <div className="flex min-w-0 flex-col gap-3 break-words">
        <p className="caps-label text-brand">{business.category.name}</p>
        <h1 className="font-display text-4xl leading-none md:text-5xl">{business.name}</h1>
        {business.description && (
          <p className="text-base text-muted-strong">{business.description}</p>
        )}
      </div>
    </Card>
  );
}
