import { ApiError } from '@/shared/api/api-error';
import { listBusinesses } from '../api/businesses.api';
import { BusinessList } from '../components/BusinessList';
import { BusinessListEmpty } from '../components/BusinessListEmpty';
import { BusinessListError } from '../components/BusinessListError';
import { ListPagination } from '../components/ListPagination';
import { pageHref } from '../domain/pagination';

// Listado del inicio (US-01). Se pide en el servidor; la carga la muestra el <Suspense> de la ruta.
export async function BusinessListPage({ page }: { page: number }) {
  let result;
  try {
    result = await listBusinesses({ page });
  } catch (error) {
    // Un ApiError es un caso previsto (sin conexión, respuesta inválida). Lo demás es un error
    // de programación y tiene que llegar al manejador de errores de Next.
    if (error instanceof ApiError) {
      return <BusinessListError code={error.code} retryHref={pageHref(page)} />;
    }
    throw error;
  }

  if (result.data.length === 0) {
    return <BusinessListEmpty total={result.total} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <BusinessList businesses={result.data} />
      <ListPagination page={result.page} limit={result.limit} total={result.total} />
    </div>
  );
}
