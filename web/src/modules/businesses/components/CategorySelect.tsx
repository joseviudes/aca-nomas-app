'use client';

import { useRouter } from 'next/navigation';
import { startTransition, useId, useOptimistic, type ChangeEvent } from 'react';
import { listHref } from '../domain/list-href';
import type { Category } from '../schemas/category-list.schema';

// En el celular, un desplegable en lugar de las pestañas: once rubros no entran a 390 px y una fila
// que se desplaza de costado esconde la mayoría. Es lo único de cliente del filtro: al elegir un
// rubro navega solo, sin botón.
export function CategorySelect({
  categories,
  category,
}: {
  categories: Category[];
  category?: string;
}) {
  const router = useRouter();
  const id = useId();
  // Muestra el rubro elegido mientras llega la página nueva; después vuelve a mandar el de la URL.
  const [selected, setSelected] = useOptimistic(category ?? '');

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;
    startTransition(() => {
      setSelected(value);
      // "Todo" es el valor vacío: vuelve a "/". Cambiar de rubro vuelve a la primera página.
      router.push(listHref({ category: value || undefined }));
    });
  }

  return (
    // Sin JavaScript, el formulario manda ?rubro= a "/" y el botón "Ver" de <noscript> lo envía.
    // Con JavaScript el botón no aparece: el cambio ya navega y sería un segundo paso que no hace
    // nada. "Todo" llega como ?rubro= vacío, que la ruta trata como sin rubro.
    <form method="get" action="/" className="flex flex-col gap-1.5 sm:hidden">
      <label htmlFor={id} className="text-sm font-bold">
        Rubro
      </label>
      <div className="flex gap-2">
        {/* 48 px de alto y texto de 16 px, como Input, para que el celular no haga zoom. */}
        <select
          id={id}
          name="rubro"
          value={selected}
          onChange={handleChange}
          className="h-12 w-full min-w-0 rounded-field border border-line bg-surface px-4 text-base text-ink"
        >
          <option value="">Todo</option>
          {categories.map(({ slug, name }) => (
            <option key={slug} value={slug}>
              {name}
            </option>
          ))}
        </select>
        <noscript>
          <button
            type="submit"
            className="inline-flex h-12 items-center rounded-full border-2 border-brand px-5 text-base font-bold text-brand"
          >
            Ver
          </button>
        </noscript>
      </div>
    </form>
  );
}
