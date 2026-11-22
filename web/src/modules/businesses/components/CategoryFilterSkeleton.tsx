import { cx } from '@/shared/ui/class-names';
import { CATEGORY_TABS_ROW_CLASSES } from './CategoryTabs';

const TAB_PLACEHOLDERS = 6;

// Mismo alto que CategorySelect (celular) y CategoryTabs (desde sm), para que el listado no salte
// cuando llegan los rubros.
export function CategoryFilterSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="flex flex-col gap-1.5 sm:hidden">
        <div className="h-5 w-12 rounded-full bg-mint motion-safe:animate-pulse" />
        <div className="h-12 rounded-field bg-mint motion-safe:animate-pulse" />
      </div>
      <div className={cx('hidden border-b border-line sm:flex', CATEGORY_TABS_ROW_CLASSES)}>
        {Array.from({ length: TAB_PLACEHOLDERS }, (_, index) => (
          <div key={index} className="flex h-12 items-center">
            <div className="h-6 w-20 rounded-full bg-mint motion-safe:animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
