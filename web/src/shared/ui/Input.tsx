import type { InputHTMLAttributes } from 'react';
import { cx } from './class-names';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  // El id es obligatorio para unir el campo con su label, su ayuda y su error.
  id: string;
  label: string;
  // Oculta el label a la vista, pero lo deja para el lector de pantalla.
  hideLabel?: boolean;
  hint?: string;
  error?: string;
};

// Copia idéntica en web/ y panel/ (D-38).
export function Input({
  id,
  label,
  hideLabel = false,
  hint,
  error,
  className,
  ...props
}: InputProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={cx('text-sm font-bold', hideLabel && 'sr-only')}>
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cx(
          // 48 px de alto y texto de 16 px, para que el celular no haga zoom (docs/diseno.md, sección 9).
          'h-12 w-full rounded-field border bg-surface px-4 text-base text-ink placeholder:text-muted',
          error ? 'border-2 border-ink' : 'border-line',
          className,
        )}
        {...props}
      />
      {hint && (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="rounded-field bg-alert px-3 py-2 text-sm text-ink">
          {error}
        </p>
      )}
    </div>
  );
}
