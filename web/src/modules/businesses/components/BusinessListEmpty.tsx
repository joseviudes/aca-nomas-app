import Link from 'next/link';
import { Card } from '@/shared/ui/Card';
import { listHref } from '../domain/list-href';

const linkClass =
  'inline-flex min-h-11 items-center rounded-full bg-accent px-5 text-base font-bold text-ink';

// La API devuelve data vacía, no un error, en tres casos:
// - total 0 sin rubro: todavía no hay negocios;
// - total 0 con rubro: el rubro no tiene negocios, o no existe (un enlace mal copiado);
// - con negocios pero sin data: la página pedida no existe. Se vuelve a la primera, con el rubro.
export function BusinessListEmpty({ total, category }: { total: number; category?: string }) {
  if (total === 0 && !category) {
    return (
      <Card tone="mint" as="section">
        <p className="text-base">Todavía no hay negocios cargados en Mantilla.</p>
      </Card>
    );
  }

  if (total === 0) {
    return (
      <Card tone="mint" as="section" className="flex flex-col items-start gap-4">
        <p className="text-base">No hay negocios de este rubro todavía.</p>
        <Link href={listHref()} className={linkClass}>
          Ver todos
        </Link>
      </Card>
    );
  }

  return (
    <Card tone="mint" as="section" className="flex flex-col items-start gap-4">
      <p className="text-base">Esta página no tiene negocios.</p>
      <Link href={listHref({ category })} className={linkClass}>
        Ir a la primera página
      </Link>
    </Card>
  );
}
