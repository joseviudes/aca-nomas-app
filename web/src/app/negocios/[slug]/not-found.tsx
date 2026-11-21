import { BusinessNotFound } from '@/modules/businesses';

// La muestra notFound() cuando la API responde BUSINESS_NOT_FOUND (US-08).
export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-page flex-col gap-6 px-5 py-6 md:px-8 md:py-10">
      <BusinessNotFound />
    </main>
  );
}
