import { BUSINESS_GRID_CLASSES } from './BusinessList';

const PLACEHOLDERS = 6;

// Misma forma que BusinessList y BusinessCard (filas en el celular, tarjetas desde sm), para que
// la pantalla no salte cuando llegan los datos.
export function BusinessListSkeleton() {
  return (
    <ul aria-busy="true" aria-label="Cargando negocios" className={BUSINESS_GRID_CLASSES}>
      {Array.from({ length: PLACEHOLDERS }, (_, index) => (
        <li
          key={index}
          className="flex items-center gap-3.5 border-b border-mint py-3.5 motion-safe:animate-pulse sm:flex-col sm:items-stretch sm:gap-0 sm:border-b-0 sm:py-0"
        >
          <div className="size-23 shrink-0 rounded-card bg-mint sm:aspect-square sm:size-auto sm:w-full" />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:pt-4">
            <div className="h-5 w-2/3 rounded-full bg-mint sm:h-6" />
            <div className="h-4 w-1/3 rounded-full bg-mint" />
            <div className="h-6 w-20 rounded-full bg-mint sm:hidden" />
          </div>
        </li>
      ))}
    </ul>
  );
}
