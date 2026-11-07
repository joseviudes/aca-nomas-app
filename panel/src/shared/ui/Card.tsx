import type { HTMLAttributes } from 'react';
import { cx } from './class-names';

// Los bloques se separan por color de fondo, nunca con sombra (docs/diseno.md, sección 6).
type CardTone = 'surface' | 'mint' | 'sand' | 'brand';

const tones: Record<CardTone, string> = {
  surface: 'bg-surface text-ink',
  mint: 'bg-mint text-ink',
  sand: 'bg-sand text-ink',
  brand: 'bg-brand text-paper',
};

type CardProps = HTMLAttributes<HTMLElement> & {
  tone?: CardTone;
  as?: 'div' | 'section' | 'article';
};

// Copia idéntica en web/ y panel/ (D-38).
export function Card({ tone = 'surface', as: Tag = 'div', className, ...props }: CardProps) {
  return <Tag className={cx('rounded-card p-5 md:p-7', tones[tone], className)} {...props} />;
}
