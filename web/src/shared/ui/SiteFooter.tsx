// Pie de toda la web. Solo para la web: el panel tiene su propio layout.
export function SiteFooter() {
  return (
    <footer className="bg-brand text-paper">
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-3 px-5 py-6 md:px-8 md:py-8">
        <span className="text-xl font-bold">acánomás</span>
        <span className="text-sm">Mantilla, Corrientes</span>
      </div>
    </footer>
  );
}
