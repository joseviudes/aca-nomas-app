import type { Metadata } from 'next';
import { Figtree, Urbanist } from 'next/font/google';
import { SiteFooter } from '@/shared/ui/SiteFooter';
import { SiteHeader } from '@/shared/ui/SiteHeader';
import './globals.css';

// next/font descarga las fuentes al compilar y las sirve desde la propia web: el navegador no le
// pide nada a Google (D-38). Las variables las usa theme.css (--font-display y --font-body).
const urbanist = Urbanist({
  variable: '--typeface-display',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

const figtree = Figtree({
  variable: '--typeface-body',
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AcáNomás',
  description: 'Directorio de negocios locales',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="es" className={`${urbanist.variable} ${figtree.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
