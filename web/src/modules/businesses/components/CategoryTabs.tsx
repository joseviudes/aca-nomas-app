import Link from 'next/link';
import { cx } from '@/shared/ui/class-names';
import { listHref } from '../domain/list-href';
import type { Category } from '../schemas/category-list.schema';

// Fila de pestañas desde sm, como el mockup: los rubros en font-display con un punto brand bajo el
// elegido. El padding de arriba y de los costados deja lugar al contorno del foco, que el
// desplazamiento de costado recortaría. CategoryFilterSkeleton copia estas medidas.
export const CATEGORY_TABS_ROW_CLASSES = 'gap-8 px-1 pt-1 pb-3';

// Son enlaces y no botones: cada rubro tiene su URL, que se puede compartir y abre sin JavaScript.
// Al elegir otro rubro se vuelve a la primera página.
export function CategoryTabs({
  categories,
  category,
}: {
  categories: Category[];
  category?: string;
}) {
  const tabs = [{ slug: undefined, name: 'Todo' }, ...categories];

  return (
    <nav aria-label="Rubros" className="hidden border-b border-line sm:block">
      {/* Con todos los rubros la fila puede no entrar: se desplaza ella, nunca la página. */}
      <ul className={cx('flex overflow-x-auto', CATEGORY_TABS_ROW_CLASSES)}>
        {tabs.map(({ slug, name }) => {
          // Sin rubro, la elegida es "Todo".
          const isActive = slug === category;

          return (
            <li key={slug ?? ''} className="shrink-0">
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
