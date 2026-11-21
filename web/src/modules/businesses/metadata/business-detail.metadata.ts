import type { Metadata } from 'next';
import { ApiError } from '@/shared/api/api-error';
import { getBusiness } from '../api/businesses.api';
import { businessShareTexts } from '../domain/business-display';

// Vista previa al compartir la ficha por WhatsApp o redes (D-27). Nunca lanza un ApiError: si
// fallara, rompería la página entera aunque esta tenga su propio estado de error. El 404 lo
// dispara la página, no la metadata.
export async function businessDetailMetadata(slug: string): Promise<Metadata> {
  try {
    const { title, description } = businessShareTexts(await getBusiness(slug));

    return { title, description, openGraph: { title, description, type: 'website' } };
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;

    if (error.code === 'BUSINESS_NOT_FOUND') return { title: 'Negocio no encontrado | AcáNomás' };

    return {};
  }
}
