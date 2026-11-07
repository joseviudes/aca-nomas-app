import Link from 'next/link';

// Encabezado de toda la web. Solo para la web: el panel tiene su propio layout.
export function SiteHeader() {
  return (
    <header>
      <div className="mx-auto flex max-w-page items-center justify-between gap-4 px-5 py-4 md:px-8 md:py-5">
        <Link href="/" className="text-2xl font-bold text-brand">
          acánomás
        </Link>
        {/* Una sola localidad en el MVP (D-20). */}
        <span className="caps-label">Mantilla</span>
      </div>
    </header>
  );
}
