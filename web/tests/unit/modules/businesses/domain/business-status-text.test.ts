import { describe, expect, it } from 'vitest';
import { SOON_MINUTES, statusText } from '@/modules/businesses/domain/business-status-text';
import type { BusinessState } from '@/modules/businesses/schemas/business-list.schema';

// La zona llega en schedule.timezone; en las pruebas va fija para que den igual en cualquier
// máquina. Buenos Aires es UTC-3 todo el año (sin horario de verano). "Ahora" es martes
// 17/11/2026 a las 12:00 locales.
const LOCALITY_TIME_ZONE = 'America/Argentina/Buenos_Aires';
const NOW = new Date('2026-11-17T15:00:00Z');

function at(state: BusinessState, closesAt: string | null, nextOpeningAt: string | null) {
  return { state, closesAt, nextOpeningAt };
}

describe('statusText', () => {
  it('uses a soon window of 60 minutes', () => {
    expect(SOON_MINUTES).toBe(60);
  });

  describe('open', () => {
    it.each([
      ['40 minutes left', '2026-11-17T15:40:00Z', 'Cierra en 40 min · 12:40'],
      ['exactly 60 minutes left', '2026-11-17T16:00:00Z', 'Cierra en 60 min · 13:00'],
      ['30 seconds left (rounds up)', '2026-11-17T15:00:30Z', 'Cierra en 1 min · 12:00'],
    ])('emphasizes when %s', (_name, closesAt, text) => {
      expect(statusText(at('open', closesAt, null), NOW, LOCALITY_TIME_ZONE)).toEqual({
        text,
        emphasized: true,
      });
    });

    it('says "en N min" instead of "mañana" when it closes soon after midnight', () => {
      // 23:30 del martes local; cierra a las 00:10 del miércoles.
      const now = new Date('2026-11-18T02:30:00Z');
      expect(statusText(at('open', '2026-11-18T03:10:00Z', null), now, LOCALITY_TIME_ZONE)).toEqual(
        { text: 'Cierra en 40 min · 00:10', emphasized: true },
      );
    });

    it.each([
      ['61 minutes left', NOW, '2026-11-17T16:01:00Z', 'Cierra a las 13:01'],
      [
        'closing after midnight (says "mañana")',
        new Date('2026-11-17T02:00:00Z'),
        '2026-11-17T05:00:00Z',
        'Cierra mañana a las 02:00',
      ],
      [
        'closing at 00:00 (never 24:00)',
        new Date('2026-11-17T00:00:00Z'),
        '2026-11-17T03:00:00Z',
        'Cierra mañana a las 00:00',
      ],
      [
        'closing tomorrow later than the current hour',
        NOW,
        '2026-11-19T01:00:00Z',
        'Cierra mañana a las 22:00',
      ],
      [
        'closing tomorrow earlier than the current hour',
        NOW,
        '2026-11-18T14:00:00Z',
        'Cierra mañana a las 11:00',
      ],
      ['closing in 3 days', NOW, '2026-11-20T15:00:00Z', 'Cierra el viernes a las 12:00'],
      [
        'closing 7 or more days away',
        NOW,
        '2026-11-24T12:00:00Z',
        'Cierra el próximo martes a las 09:00',
      ],
    ])('does not emphasize when %s', (_name, now, closesAt, text) => {
      expect(statusText(at('open', closesAt, null), now, LOCALITY_TIME_ZONE)).toEqual({
        text,
        emphasized: false,
      });
    });

    it('says it is open 24 hours when it never closes (closesAt null)', () => {
      expect(statusText(at('open', null, null), NOW, LOCALITY_TIME_ZONE)).toEqual({
        text: 'Abierto las 24 horas',
        emphasized: false,
      });
    });

    it.each([
      ['closing time equal to now', '2026-11-17T15:00:00Z'],
      ['closing time in the past (stale response)', '2026-11-17T14:00:00Z'],
    ])('has no line with %s', (_name, closesAt) => {
      expect(statusText(at('open', closesAt, null), NOW, LOCALITY_TIME_ZONE)).toBeNull();
    });
  });

  describe('closed', () => {
    it('emphasizes an opening in 20 minutes', () => {
      expect(
        statusText(at('closed', null, '2026-11-17T15:20:00Z'), NOW, LOCALITY_TIME_ZONE),
      ).toEqual({ text: 'Abre en 20 min · 12:20', emphasized: true });
    });

    it.each([
      ['in 61 minutes (not soon)', '2026-11-17T16:01:00Z', 'Abre a las 13:01'],
      ['later today', '2026-11-17T21:00:00Z', 'Abre a las 18:00'],
      ['tomorrow', '2026-11-18T12:00:00Z', 'Abre mañana a las 09:00'],
      ['in 3 days', '2026-11-20T12:00:00Z', 'Abre el viernes a las 09:00'],
      ['in 7 days', '2026-11-24T12:00:00Z', 'Abre el próximo martes a las 09:00'],
    ])('says when it opens %s', (_name, nextOpeningAt, text) => {
      expect(statusText(at('closed', null, nextOpeningAt), NOW, LOCALITY_TIME_ZONE)).toEqual({
        text,
        emphasized: false,
      });
    });

    it('has no line without a next opening', () => {
      expect(statusText(at('closed', null, null), NOW, LOCALITY_TIME_ZONE)).toBeNull();
    });

    it('says "en N min" instead of "mañana" when it opens soon after midnight', () => {
      // 23:45 del martes local; abre a las 00:15 del miércoles.
      const now = new Date('2026-11-18T02:45:00Z');
      expect(
        statusText(at('closed', null, '2026-11-18T03:15:00Z'), now, LOCALITY_TIME_ZONE),
      ).toEqual({ text: 'Abre en 30 min · 00:15', emphasized: true });
    });

    it('uses the local calendar day, not the UTC one', () => {
      // 22:00 del lunes local ya es el martes en UTC; la apertura es martes 09:00 local.
      const now = new Date('2026-11-17T01:00:00Z');
      expect(
        statusText(at('closed', null, '2026-11-17T12:00:00Z'), now, LOCALITY_TIME_ZONE),
      ).toEqual({ text: 'Abre mañana a las 09:00', emphasized: false });
    });
  });

  describe('closed_today', () => {
    // La etiqueta ya dice "Hoy no abre": la línea solo dice cuándo vuelve.
    it.each([
      ['tomorrow', '2026-11-18T12:00:00Z', 'Vuelve mañana a las 09:00'],
      ['another day', '2026-11-20T12:00:00Z', 'Vuelve el viernes a las 09:00'],
      ['in 7 days', '2026-11-24T12:00:00Z', 'Vuelve el próximo martes a las 09:00'],
      ['the same day (unexpected)', '2026-11-17T15:40:00Z', 'Vuelve a las 12:40'],
    ])('says when it returns %s, never "en N min" nor emphasized', (_name, next, text) => {
      expect(statusText(at('closed_today', null, next), NOW, LOCALITY_TIME_ZONE)).toEqual({
        text,
        emphasized: false,
      });
    });

    it('has no line without a next opening', () => {
      expect(statusText(at('closed_today', null, null), NOW, LOCALITY_TIME_ZONE)).toBeNull();
    });
  });

  describe('paused', () => {
    it('has no line even with dates (the pause reason is not stored)', () => {
      expect(
        statusText(
          at('paused', '2026-11-17T15:40:00Z', '2026-11-18T12:00:00Z'),
          NOW,
          LOCALITY_TIME_ZONE,
        ),
      ).toBeNull();
    });
  });

  describe('time zone', () => {
    it('formats the same instant differently per zone', () => {
      const status = at('open', '2026-11-17T20:00:00Z', null);
      expect(statusText(status, NOW, 'UTC')?.text).toBe('Cierra a las 20:00');
      expect(statusText(status, NOW, LOCALITY_TIME_ZONE)?.text).toBe('Cierra a las 17:00');
    });
  });

  // Santiago de Chile tiene horario de verano. La noche del sábado 5 al domingo 6 de septiembre
  // de 2026 la medianoche salta a la 01:00 (UTC-4 a UTC-3); la del 4 al 5 de abril, las 00:00
  // vuelven a las 23:00 (UTC-3 a UTC-4). El día se compara por fecha local, no contando 24 horas.
  describe('daylight saving time', () => {
    const SANTIAGO = 'America/Santiago';

    it('says "mañana" across the night the clock moves forward', () => {
      // Sábado 22:00 (UTC-4); abre el domingo a las 09:00 (UTC-3), 10 horas reales después.
      const now = new Date('2026-09-06T02:00:00Z');
      expect(statusText(at('closed', null, '2026-09-06T12:00:00Z'), now, SANTIAGO)).toEqual({
        text: 'Abre mañana a las 09:00',
        emphasized: false,
      });
    });

    it('counts real minutes across the skipped hour', () => {
      // Sábado 23:30 (UTC-4); abre el domingo a las 01:15 (UTC-3): faltan 45 minutos, no 105.
      const now = new Date('2026-09-06T03:30:00Z');
      expect(statusText(at('closed', null, '2026-09-06T04:15:00Z'), now, SANTIAGO)).toEqual({
        text: 'Abre en 45 min · 01:15',
        emphasized: true,
      });
    });

    it('says "mañana" across the night the clock moves back', () => {
      // El segundo sábado 23:30 (UTC-4, la hora se repite); cierra el domingo a las 09:00.
      const now = new Date('2026-04-05T03:30:00Z');
      expect(statusText(at('open', '2026-04-05T13:00:00Z', null), now, SANTIAGO)).toEqual({
        text: 'Cierra mañana a las 09:00',
        emphasized: false,
      });
    });
  });

  describe('invalid input', () => {
    it.each(['open', 'closed', 'closed_today'] as const)(
      'returns null for an invalid date in %s without throwing',
      (state) => {
        expect(() =>
          statusText(at(state, 'not-a-date', 'not-a-date'), NOW, LOCALITY_TIME_ZONE),
        ).not.toThrow();
        expect(
          statusText(at(state, 'not-a-date', 'not-a-date'), NOW, LOCALITY_TIME_ZONE),
        ).toBeNull();
      },
    );

    it.each([
      ['open', '2026-11-17T15:40:00Z', null],
      ['closed', null, '2026-11-17T15:40:00Z'],
      ['closed_today', null, '2026-11-18T12:00:00Z'],
    ] as const)(
      'returns null for an invalid time zone in %s without throwing',
      (state, closesAt, nextOpeningAt) => {
        expect(statusText(at(state, closesAt, nextOpeningAt), NOW, 'Foo/Bar')).toBeNull();
      },
    );
  });
});
