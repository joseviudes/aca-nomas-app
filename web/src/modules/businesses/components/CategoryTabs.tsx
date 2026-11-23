import Link from 'next/link';
import { cx } from '@/shared/ui/class-names';
import { listHref } from '../domain/list-href';
import type { Category } from '../schemas/category-list.schema';

// Pestañas desde sm, como el mockup: los rubros en font-display con un punto brand bajo el elegido.
// Con "Todo" y los diez rubros del seed no entran en una fila, ni siquiera a 1280 px: pasan a la
// fila de abajo en lugar de desplazarse de costado, que mostraría una barra en Windows y escondería
// rubros sin avisar. CategoryFilterSkeleton copia estas medidas.
export const CATEGORY_TABS_GAP_CLASSES = 'gap-x-6 gap-y-2 lg:gap-x-8';

// Son enlaces y no botones: cada rubro tiene su URL, que se puede compartir y abre sin JavaScript.
// Al elegir otro rubro se vuelve a la primera página.
export function CategoryTabs({
  categories,
  category,
}: {
  categories: Category[];
  // undefined marca "Todo"; null, ninguna (mientras se lee la URL).
  category?: string | null;
}) {
  const tabs = [{ slug: undefined, name: 'Todo' }, ...categories];

  return (
    <nav aria-label="Rubros" className="hidden border-b border-line sm:block">
      <ul className={cx('flex flex-wrap pb-3', CATEGORY_TABS_GAP_CLASSES)}>
        {tabs.map(({ slug, name }) => {
          // Sin rubro, la elegida es "Todo"; con null no coincide ninguna.
          const isActive = slug === category;

          return (
            <li key={slug ?? ''}>
              <Link
                href={listHref({ category: slug })}
                aria-current={isActive ? 'page' : undefined}
                className="flex h-12 flex-col items-center justify-center gap-1 font-display text-xl whitespace-nowrap hover:text-brand lg:text-2xl"
              >
                {name}
                {/* El punto se dibuja en todas para que la elegida no cambie de alto. */}
                <span
                  aria-hidden="true"
                  className={cx('size-1.5 rounded-full', isActive ? 'bg-brand' : 'bg-transparent')}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
