// Misma forma que BusinessDetail y WeeklySchedule, para que la pantalla no salte cuando llegan
// los datos.
export function BusinessDetailSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Cargando el negocio"
      className="flex flex-col gap-6 motion-safe:animate-pulse"
    >
      <div className="flex flex-col gap-5 rounded-card bg-sand p-5 md:p-7 sm:flex-row sm:items-center sm:gap-8">
        <div className="aspect-4/3 w-full shrink-0 rounded-card bg-mint sm:w-1/2" />
        <div className="flex w-full flex-col gap-3">
          <div className="h-4 w-24 rounded-full bg-mint" />
          <div className="h-10 w-3/4 rounded-full bg-mint" />
          <div className="h-5 w-1/2 rounded-full bg-mint" />
          <div className="h-5 w-full rounded-full bg-mint" />
        </div>
      </div>
      {/* La banda del horario: título y los 7 días. */}
      <div className="rounded-card bg-mint p-5 md:p-7">
        <div className="h-8 w-32 rounded-full bg-paper" />
        <div className="mt-5 flex flex-col gap-2 lg:w-1/2">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <div key={day} className="h-11 rounded-field bg-paper" />
          ))}
        </div>
      </div>
    </div>
  );
}
