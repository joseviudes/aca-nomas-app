import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-page flex-col items-start justify-center gap-4 px-5">
      <span className="caps-label text-brand">Error 404</span>
      <h1 className="font-display text-4xl leading-none">Página no encontrada</h1>
      <Link
        to="/"
        className="inline-flex min-h-11 items-center rounded-full border-2 border-brand px-5 font-bold text-brand"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
