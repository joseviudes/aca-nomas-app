import { describe, expect, it } from 'vitest';
import { dayName, isToday, shiftsLabel } from '@/modules/businesses/domain/weekly-schedule';

describe('dayName', () => {
  it('names the 7 days from Monday (1) to Sunday (7)', () => {
    expect([1, 2, 3, 4, 5, 6, 7].map(dayName)).toEqual([
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
      'Domingo',
    ]);
  });
});

describe('shiftsLabel', () => {
  it('says "Cerrado" for a day without shifts', () => {
    expect(shiftsLabel([])).toBe('Cerrado');
  });

  it('shows a single shift', () => {
    expect(shiftsLabel([{ opensAt: '08:00', closesAt: '20:00' }])).toBe('08:00 – 20:00');
  });

  it('joins a split shift in order', () => {
    expect(
      shiftsLabel([
        { opensAt: '08:00', closesAt: '13:00' },
        { opensAt: '17:00', closesAt: '21:30' },
      ]),
    ).toBe('08:00 – 13:00 · 17:00 – 21:30');
  });

  it('keeps a shift that crosses midnight as it comes', () => {
    expect(shiftsLabel([{ opensAt: '19:00', closesAt: '01:00' }])).toBe('19:00 – 01:00');
  });
});

describe('isToday', () => {
  it('marks the day the API says is today', () => {
    expect(isToday({ dayOfWeek: 2, shifts: [] }, 2)).toBe(true);
  });

  it('does not mark another day', () => {
    expect(isToday({ dayOfWeek: 3, shifts: [] }, 2)).toBe(false);
  });
});
