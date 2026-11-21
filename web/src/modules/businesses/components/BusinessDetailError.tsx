import Link from 'next/link';

// Según error.code, nunca según el texto técnico del error. El 404 no llega acá: tiene su página.
function errorMessage(code: string): string {
  if (code === 'NETWORK_ERROR') {
    return 'No pudimos conectarnos. Revisá tu conexión e intentá de nuevo.';
  }

  return 'No pudimos cargar este negocio. Intentá de nuevo en un rato.';
}

export function BusinessDetailError({ code, retryHref }: { code: string; retryHref: string }) {
  return (
    <section
      role="alert"
      className="flex flex-col items-start gap-4 rounded-card bg-alert p-5 md:p-7"
    >
      <p className="text-base">{errorMessage(code)}</p>
      <Link
        href={retryHref}
        className="inline-flex min-h-11 items-center rounded-full border-2 border-ink px-5 text-base font-bold text-ink"
      >
        Reintentar
      </Link>
    </section>
  );
}
