import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import {
  BusinessDetailPage,
  BusinessDetailSkeleton,
  businessDetailMetadata,
} from '@/modules/businesses';

// Ficha pública de un negocio (US-08). La URL va en español (D-29).
export async function generateMetadata({
  params,
}: PageProps<'/negocios/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  return businessDetailMetadata(slug);
}

export default function BusinessRoute({ params }: PageProps<'/negocios/[slug]'>) {
  return (
    <main className="mx-auto flex w-full max-w-page flex-col gap-6 px-5 py-6 md:px-8 md:py-10">
      {/* Fuera del <Suspense>: se ve mientras carga la ficha. */}
      <Link
        href="/"
        className="inline-flex min-h-11 items-center gap-2 self-start text-base font-bold"
      >
        <span aria-hidden="true">←</span> Volver al listado
      </Link>
      {/* Con cacheComponents, leer params fuera de un <Suspense> bloquea el prerender. */}
      <Suspense fallback={<BusinessDetailSkeleton />}>
        <BusinessDetailForPage params={params} />
      </Suspense>
    </main>
  );
}

async function BusinessDetailForPage({ params }: Pick<PageProps<'/negocios/[slug]'>, 'params'>) {
  const { slug } = await params;
  return <BusinessDetailPage slug={slug} />;
}
