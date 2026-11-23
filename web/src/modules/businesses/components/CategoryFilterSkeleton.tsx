import { cx } from '@/shared/ui/class-names';
import { CATEGORY_TABS_GAP_CLASSES } from './CategoryTabs';

// Lugares por fila de pestañas. Con el seed, las pestañas ocupan dos filas desde sm.
const TAB_PLACEHOLDERS_PER_ROW = [6, 5];

// Mismo alto que CategorySelect (celular) y CategoryTabs (desde sm, en dos filas), para que el
// listado no salte cuando llegan los rubros.
export function CategoryFilterSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="flex flex-col gap-1.5 sm:hidden">
        <div className="h-5 w-12 rounded-full bg-mint motion-safe:animate-pulse" />
        <div className="h-12 rounded-field bg-mint motion-safe:animate-pulse" />
      </div>
      <div
        className={cx(
          'hidden flex-col border-b border-line pb-3 sm:flex',
          CATEGORY_TABS_GAP_CLASSES,
        )}
      >
        {TAB_PLACEHOLDERS_PER_ROW.map((count, row) => (
          <div key={row} className={cx('flex overflow-hidden', CATEGORY_TABS_GAP_CLASSES)}>
            {Array.from({ length: count }, (_, index) => (
              <div key={index} className="flex h-12 shrink-0 items-center">
                <div className="h-6 w-20 rounded-full bg-mint motion-safe:animate-pulse" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
