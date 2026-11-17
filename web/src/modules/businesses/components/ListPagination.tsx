import Link from 'next/link';
import { hasNextPage, hasPreviousPage, pageHref, totalPages } from '../domain/pagination';

// Al menos 44 px de alto (docs/diseno.md, sección 6), con el estilo del botón secundario.
const linkClass =
  'inline-flex min-h-11 items-center rounded-full border-2 border-brand px-4 text-base font-bold text-brand';

export function ListPagination({
  page,
  limit,
  total,
}: {
  page: number;
  limit: number;
  total: number;
}) {
  const pages = totalPages({ limit, total });
  if (pages <= 1) return null;

  return (
    // Tres columnas: las de los costados miden lo mismo, así el texto queda siempre al centro
    // aunque falte uno de los enlaces.
    <nav aria-label="Paginación" className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
      <div className="justify-self-start">
        {hasPreviousPage({ page }) && (
          <Link href={pageHref(page - 1)} className={linkClass}>
            Anterior
          </Link>
        )}
      </div>
      <span className="text-center text-base text-muted">
        Página {page} de {pages}
      </span>
      <div className="justify-self-end">
        {hasNextPage({ page, limit, total }) && (
          <Link href={pageHref(page + 1)} className={linkClass}>
            Siguiente
          </Link>
        )}
      </div>
    </nav>
  );
}
