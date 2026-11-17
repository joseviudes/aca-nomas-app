import type { BusinessState } from '../schemas/business-list.schema';

// Texto de la etiqueta de estado (docs/diseno.md, sección 7). El estado siempre se muestra con
// su texto, nunca solo con el color.
const STATUS_LABELS: Record<BusinessState, string> = {
  open: 'Abierto',
  closed: 'Cerrado',
  closed_today: 'Hoy no abre',
  paused: 'Pausado',
};

export function statusLabel(state: BusinessState): string {
  return STATUS_LABELS[state];
}
