// Misma forma que BusinessDetail, para que la pantalla no salte cuando llegan los datos.
export function BusinessDetailSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Cargando el negocio"
      className="flex flex-col gap-5 rounded-card bg-sand p-5 motion-safe:animate-pulse md:p-7 lg:flex-row lg:items-center lg:gap-8"
    >
      <div className="aspect-[4/3] w-full shrink-0 rounded-card bg-mint lg:w-1/2" />
      <div className="flex w-full flex-col gap-3">
        <div className="h-4 w-24 rounded-full bg-mint" />
        <div className="h-10 w-3/4 rounded-full bg-mint" />
        <div className="h-5 w-full rounded-full bg-mint" />
      </div>
    </div>
  );
}
