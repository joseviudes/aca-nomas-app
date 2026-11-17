import { describe, expect, it } from 'vitest';
import { statusLabel } from '@/modules/businesses/domain/business-status';

describe('statusLabel', () => {
  it.each([
    ['open', 'Abierto'],
    ['closed', 'Cerrado'],
    ['closed_today', 'Hoy no abre'],
    ['paused', 'Pausado'],
  ] as const)('shows %s as %s', (state, label) => {
    expect(statusLabel(state)).toBe(label);
  });
});
