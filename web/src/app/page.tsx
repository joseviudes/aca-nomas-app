import { Suspense } from 'react';
import { BusinessListPage, BusinessListSkeleton, listPageParamSchema } from '@/modules/businesses';

// Inicio: el listado de negocios (US-01). La página va en ?pagina= (D-29).
export default function Home({ searchParams }: PageProps<'/'>) {
  return (
    <main className="mx-auto flex w-full max-w-page flex-col gap-6 px-5 py-6 md:px-8 md:py-10">
      <h1 className="font-display text-3xl leading-none md:text-4xl">Negocios de Mantilla</h1>
      {/* Con cacheComponents, leer searchParams fuera de un <Suspense> bloquea el prerender. */}
      <Suspense fallback={<BusinessListSkeleton />}>
        <BusinessListForPage searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function BusinessListForPage({ searchParams }: Pick<PageProps<'/'>, 'searchParams'>) {
  const page = listPageParamSchema.parse((await searchParams).pagina);
  // La key hace que al cambiar de página se vea la carga, en lugar de la página anterior.
  return (
    <Suspense key={page} fallback={<BusinessListSkeleton />}>
      <BusinessListPage page={page} />
    </Suspense>
  );
}
