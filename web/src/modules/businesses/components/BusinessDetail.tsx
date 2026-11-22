import { Card } from '@/shared/ui/Card';
import { cx } from '@/shared/ui/class-names';
import { businessDetailPath, businessInitial } from '../domain/business-display';
import { statusText } from '../domain/business-status-text';
import type { BusinessDetail as BusinessDetailData } from '../schemas/business-detail.schema';
import { BusinessStatusBadge } from './BusinessStatusBadge';
import { CopyLinkButton } from './CopyLinkButton';

type BusinessDetailProps = {
  business: BusinessDetailData;
  // Hora del servidor al armar la ficha: el texto "Cierra en 40 min" se calcula con ella, nunca
  // con el reloj del navegador, para que la página llegue armada igual que la pidió la API.
  now: Date;
};

// Ficha pública (US-08 y US-09). En el celular, una columna; desde sm, la foto y los datos lado a
// lado. Contacto y pagos se suman con US-10 y US-17 (docs/mockup/web.md).
export function BusinessDetail({ business, now }: BusinessDetailProps) {
  // El estado lo decide la API; la web solo dice cuándo cambia, en la hora de la localidad.
  const line = statusText(business.status, now, business.schedule.timezone);

  return (
    <Card
      as="article"
      tone="sand"
      className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8"
    >
      {/* Hasta US-19 no hay fotos: el lugar de la foto queda en mint con la inicial (docs/diseno.md, sección 4). */}
      <div className="relative flex aspect-4/3 w-full shrink-0 items-center justify-center rounded-card bg-mint sm:w-1/2">
        <span aria-hidden="true" className="font-display text-8xl text-brand">
          {businessInitial(business.name)}
        </span>
        <span className="caps-label absolute bottom-3.5 left-4 text-brand">Sin foto</span>
        {/* Como en el mockup, la etiqueta va sobre la foto, en todos los anchos. */}
        <div className="absolute top-3.5 left-3.5">
          <BusinessStatusBadge state={business.status.state} />
        </div>
      </div>
      <div className="flex min-w-0 flex-col gap-3 break-words">
        <p className="caps-label text-brand">{business.category.name}</p>
        <h1 className="font-display text-4xl leading-none md:text-5xl">{business.name}</h1>
        {/* Sin línea si está en pausa o falta el dato: la etiqueta ya dice el estado. */}
        {line && <p className={cx('text-base', line.emphasized && 'font-bold')}>{line.text}</p>}
        {business.description && (
          <p className="text-base text-muted-strong">{business.description}</p>
        )}
        {/* El mockup lo pone en el bloque de contacto, que llega con US-10 (desvío explicado en el PR). */}
        <div className="pt-2">
          <CopyLinkButton path={businessDetailPath(business.slug)} />
        </div>
      </div>
    </Card>
  );
}
