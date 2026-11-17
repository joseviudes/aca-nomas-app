import { cx } from '@/shared/ui/class-names';
import { statusLabel } from '../domain/business-status';
import type { BusinessState } from '../schemas/business-list.schema';

// Colores de cada estado (docs/diseno.md, sección 7).
const styles: Record<BusinessState, string> = {
  open: 'bg-accent',
  closed: 'border border-ink bg-paper',
  closed_today: 'border border-dashed border-ink bg-alert',
  paused: 'border border-dashed border-ink bg-alert',
};

export function BusinessStatusBadge({ state }: { state: BusinessState }) {
  return (
    <span
      className={cx(
        'caps-label inline-flex items-center rounded-full px-3 py-1 text-ink',
        styles[state],
      )}
    >
      {statusLabel(state)}
    </span>
  );
}
