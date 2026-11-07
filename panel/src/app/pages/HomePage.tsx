import { Card } from '../../shared/ui/Card';

// Inicio provisorio: el estado del negocio llega con US-25.
export function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="caps-label text-brand">Inicio</span>
        <h1 className="mt-2 font-display text-4xl leading-none md:text-5xl">Tu panel</h1>
      </div>
      <Card tone="sand" as="section">
        <p>
          Acá vas a ver cómo te ven los vecinos ahora y vas a poder editar tu ficha y tus horarios.
        </p>
      </Card>
    </div>
  );
}
