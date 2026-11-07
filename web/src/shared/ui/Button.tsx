import type { ButtonHTMLAttributes } from 'react';
import { cx } from './class-names';

// primary: la acción principal de la web (lima). brand: la principal del panel (verde oscuro).
// secondary: acciones de menor peso, con borde.
type ButtonVariant = 'primary' | 'brand' | 'secondary';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-ink',
  brand: 'bg-brand text-paper',
  secondary: 'border-2 border-brand bg-transparent text-brand',
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

// Copia idéntica en web/ y panel/ (D-38).
export function Button({ variant = 'primary', type = 'button', className, ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        // Al menos 44 px de alto (docs/diseno.md, sección 6).
        'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-base font-bold',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
