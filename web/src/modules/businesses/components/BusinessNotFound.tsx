import Link from 'next/link';
import { Card } from '@/shared/ui/Card';

// Página 404 de una ficha que no existe (US-08). El mockup no la muestra: se arma con los tokens
// y los componentes de shared/ui (docs/mockup/web.md, sección 5).
export function BusinessNotFound() {
  return (
    <Card as="section" tone="mint" className="flex flex-col items-start gap-4">
      <p className="caps-label text-brand">Error 404</p>
      <h1 className="font-display text-4xl leading-none md:text-5xl">
        No encontramos este negocio
      </h1>
      <p className="text-base text-muted-strong">
        Puede que el enlace esté mal escrito o que la ficha ya no esté publicada.
      </p>
      <Link
        href="/"
        className="inline-flex min-h-11 items-center rounded-full bg-brand px-5 text-base font-bold text-paper"
      >
        Ver todos los negocios
      </Link>
    </Card>
  );
}
