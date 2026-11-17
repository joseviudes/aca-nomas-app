const PLACEHOLDERS = 6;

// Misma grilla que BusinessList, para que la pantalla no salte cuando llegan los datos.
export function BusinessListSkeleton() {
  return (
    <ul
      aria-busy="true"
      aria-label="Cargando negocios"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: PLACEHOLDERS }, (_, index) => (
        <li
          key={index}
          className="flex flex-col gap-4 rounded-card bg-surface p-5 motion-safe:animate-pulse md:p-7"
        >
          <div className="aspect-video w-full rounded-field bg-mint" />
          <div className="h-6 w-2/3 rounded-full bg-mint" />
          <div className="h-4 w-1/3 rounded-full bg-mint" />
          <div className="h-7 w-24 rounded-full bg-mint" />
        </li>
      ))}
    </ul>
  );
}
