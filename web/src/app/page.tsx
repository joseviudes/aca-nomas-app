import { Card } from '@/shared/ui/Card';

// Inicio provisorio: el listado de negocios llega con US-01.
export default function Home() {
  return (
    <main className="mx-auto w-full max-w-page px-5 py-6 md:px-8 md:py-10">
      <Card tone="brand" as="section" className="flex flex-col gap-4">
        <span className="caps-label text-accent">Negocios de tu barrio</span>
        <h1 className="font-display text-4xl leading-none md:text-5xl">¿Qué está abierto ahora?</h1>
        <p className="max-w-prose text-base">
          Muy pronto, todos los negocios de Mantilla en un solo lugar.
        </p>
      </Card>
    </main>
  );
}
