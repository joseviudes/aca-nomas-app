import { Suspense } from 'react';
import { ApiError } from '@/shared/api/api-error';
import { listCategories } from '../api/businesses.api';
import { CategorySelect } from '../components/CategorySelect';
import { CategoryTabs } from '../components/CategoryTabs';
import { activeCategory } from '../domain/active-category';
import type { Category } from '../schemas/category-list.schema';

// Filtro por rubro del inicio (US-03): desplegable en el celular y pestañas desde sm.
// Los rubros salen de la caché (listCategories) y no dependen de la URL, así que el filtro entra en
// la parte estática de la página. Lo único que depende de la URL es cuál está elegido: llega como
// promesa y se resuelve dentro de un <Suspense> propio, el único hueco dinámico del filtro.
export async function CategoryFilterPage({ category }: { category: Promise<string | undefined> }) {
  let categories;

  try {
    categories = (await listCategories()).data;
  } catch (error) {
    // Sin rubros no hay filtro, pero el listado sigue sirviendo: no se muestra un error por esto.
    // El listado sube a ocupar el lugar del filtro; se acepta ese salto porque es un caso raro.
    // Un fallo no queda en la parte estática: listCategories lo guarda solo unos segundos (como
    // mucho un minuto) y en la visita siguiente se vuelve a pedir.
    if (error instanceof ApiError) return null;

    throw error;
  }

  // Sin rubros cargados no hay nada que filtrar. Mismo salto del listado que arriba.
  if (categories.length === 0) return null;

  return (
    // Mientras se lee la URL, el filtro ya se ve con todos los rubros y ninguno marcado.
    <Suspense fallback={<CategoryFilter categories={categories} active={null} />}>
      <CategoryFilterWithActive categories={categories} category={category} />
    </Suspense>
  );
}

async function CategoryFilterWithActive({
  categories,
  category,
}: {
  categories: Category[];
  category: Promise<string | undefined>;
}) {
  // Se calcula una vez para las dos vistas, así nunca marcan rubros distintos.
  return (
    <CategoryFilter categories={categories} active={activeCategory(categories, await category)} />
  );
}

// active: undefined es "Todo"; null, que todavía no se sabe (no se marca ninguna pestaña).
function CategoryFilter({
  categories,
  active,
}: {
  categories: Category[];
  active: string | undefined | null;
}) {
  return (
    <>
      <CategorySelect categories={categories} category={active ?? undefined} />
      <CategoryTabs categories={categories} category={active} />
    </>
  );
}
