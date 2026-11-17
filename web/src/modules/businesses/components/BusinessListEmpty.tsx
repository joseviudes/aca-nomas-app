import Link from 'next/link';
import { Card } from '@/shared/ui/Card';
import { pageHref } from '../domain/pagination';

// total 0: todavía no hay negocios. Con negocios pero sin data, la página pedida no existe
// (la API devuelve data vacía, no un error).
export function BusinessListEmpty({ total }: { total: number }) {
  if (total === 0) {
    return (
      <Card tone="mint" as="section">
        <p className="text-base">Todavía no hay negocios cargados en Mantilla.</p>
      </Card>
    );
  }

  return (
    <Card tone="mint" as="section" className="flex flex-col items-start gap-4">
      <p className="text-base">Esta página no tiene negocios.</p>
      <Link
        href={pageHref(1)}
        className="inline-flex min-h-11 items-center rounded-full bg-accent px-5 text-base font-bold text-ink"
      >
        Ir a la primera página
      </Link>
    </Card>
  );
}
