import { ApiError } from '@/shared/api/api-error';
import { listCategories } from '../api/businesses.api';
import { CategorySelect } from '../components/CategorySelect';
import { CategoryTabs } from '../components/CategoryTabs';

// Filtro por rubro del inicio (US-03): desplegable en el celular y pestañas desde sm. Se pide en
// el servidor; la carga la muestra el <Suspense> de la ruta, separado del listado.
export async function CategoryFilterPage({ category }: { category?: string }) {
  let categories;

  try {
    categories = (await listCategories()).data;
  } catch (error) {
    // Sin rubros no hay filtro, pero el listado sigue sirviendo: no se muestra un error por esto.
    if (error instanceof ApiError) return null;

    throw error;
  }

  if (categories.length === 0) return null;

  return (
    <>
      <CategorySelect categories={categories} category={category} />
      <CategoryTabs categories={categories} category={category} />
    </>
  );
}
