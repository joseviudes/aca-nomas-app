import Link from 'next/link';
import { hasNextPage, hasPreviousPage, pageHref, totalPages } from '../domain/pagination';

// Al menos 44 px de alto (docs/diseno.md, sección 6), con el estilo del botón secundario.
const linkClass =
  'inline-flex min-h-11 items-center rounded-full border-2 border-brand px-5 text-base font-bold text-brand';

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
    <nav aria-label="Paginación" className="flex flex-wrap items-center justify-between gap-3">
      {hasPreviousPage({ page }) ? (
        <Link href={pageHref(page - 1)} className={linkClass}>
          Anterior
        </Link>
      ) : (
        // Ocupa el lugar del enlace para que el texto quede siempre al centro.
        <span aria-hidden="true" />
      )}
      <span className="text-base text-muted">
        Página {page} de {pages}
      </span>
      {hasNextPage({ page, limit, total }) ? (
        <Link href={pageHref(page + 1)} className={linkClass}>
          Siguiente
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  );
}
