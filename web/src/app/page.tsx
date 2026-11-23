import { Suspense } from 'react';
import {
  BusinessListPage,
  BusinessListSkeleton,
  CategoryFilterPage,
  CategoryFilterSkeleton,
  listCategoryParamSchema,
  listPageParamSchema,
} from '@/modules/businesses';

// Inicio: el listado de negocios (US-01) con el filtro por rubro (US-03). El rubro va en ?rubro= y
// la página en ?pagina= (D-44); la web los traduce a category y page al pedir los datos.
export default function Home({ searchParams }: PageProps<'/'>) {
  // Sin await: la promesa baja al filtro, que la lee recién dentro de su propio <Suspense>. Así los
  // rubros, que no dependen de la URL, entran en la parte estática de la página.
  const category = searchParams.then(({ rubro }) => listCategoryParamSchema.parse(rubro));

  return (
    <main className="mx-auto flex w-full max-w-page flex-col gap-6 px-5 py-6 md:px-8 md:py-10">
      <h1 className="font-display text-3xl leading-none md:text-4xl">Negocios de Mantilla</h1>
      {/* Con cacheComponents, leer searchParams fuera de un <Suspense> bloquea el prerender.
          El filtro tiene el suyo, fuera del listado: al cambiar de rubro o de página sigue a la
          vista mientras carga la lista. El esqueleto solo se ve si los rubros no llegaron al
          armar la parte estática. */}
      <Suspense fallback={<CategoryFilterSkeleton />}>
        <CategoryFilterPage category={category} />
      </Suspense>
      <Suspense fallback={<BusinessListSkeleton />}>
        <BusinessListForPage searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function BusinessListForPage({ searchParams }: Pick<PageProps<'/'>, 'searchParams'>) {
  const params = await searchParams;
  const page = listPageParamSchema.parse(params.pagina);
  const category = listCategoryParamSchema.parse(params.rubro);

  // La key hace que al cambiar de rubro o de página se vea la carga, en lugar de la lista anterior.
  return (
    <Suspense key={`${category ?? ''}:${page}`} fallback={<BusinessListSkeleton />}>
      <BusinessListPage page={page} category={category} />
    </Suspense>
  );
}
