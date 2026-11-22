import { notFound } from 'next/navigation';
import { ApiError } from '@/shared/api/api-error';
import { getBusiness } from '../api/businesses.api';
import { BusinessDetail } from '../components/BusinessDetail';
import { BusinessDetailError } from '../components/BusinessDetailError';
import { businessDetailPath } from '../domain/business-display';

// Ficha pública (US-08 y US-09). Se pide en el servidor (D-27); la carga la muestra el <Suspense> de la ruta.
export async function BusinessDetailPage({ slug }: { slug: string }) {
  let business;

  try {
    business = await getBusiness(slug);
  } catch (error) {
    // Un ApiError es un caso previsto. Lo demás es un error de programación y tiene que llegar al
    // manejador de errores de Next.
    if (!(error instanceof ApiError)) throw error;

    // notFound() funciona lanzando: va en el catch, nunca dentro del try, que se lo tragaría.
    if (error.code === 'BUSINESS_NOT_FOUND') notFound();

    return <BusinessDetailError code={error.code} retryHref={businessDetailPath(slug)} />;
  }

  // La hora se lee recién acá, después del pedido sin caché: con cacheComponents, leer el reloj
  // antes de algo dinámico haría que Next la congele al prerenderizar. Va por parámetro a los
  // componentes para que el texto de estado salga de una sola hora, la del servidor.
  const now = new Date();

  return <BusinessDetail business={business} now={now} />;
}
