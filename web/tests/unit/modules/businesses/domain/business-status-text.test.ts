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
      ['40 minutes left', '2026-11-17T15:40:00Z', 'Cierra en 40 min · 12:40', 'Cierra en 40 min'],
      [
        'exactly 60 minutes left',
        '2026-11-17T16:00:00Z',
        'Cierra en 60 min · 13:00',
        'Cierra en 60 min',
      ],
      [
        '30 seconds left (rounds up)',
        '2026-11-17T15:00:30Z',
        'Cierra en 1 min · 12:00',
        'Cierra en 1 min',
      ],
    ])('emphasizes when %s', (_name, closesAt, text, shortText) => {
      expect(statusText(at('open', closesAt, null), NOW, LOCALITY_TIME_ZONE)).toEqual({
        text,
        shortText,
        emphasized: true,
      });
    });

    it('says "en N min" instead of "mañana" when it closes soon after midnight', () => {
      // 23:30 del martes local; cierra a las 00:10 del miércoles.
      const now = new Date('2026-11-18T02:30:00Z');
      expect(statusText(at('open', '2026-11-18T03:10:00Z', null), now, LOCALITY_TIME_ZONE)).toEqual(
        { text: 'Cierra en 40 min · 00:10', shortText: 'Cierra en 40 min', emphasized: true },
      );
    });

    it.each([
      ['61 minutes left', NOW, '2026-11-17T16:01:00Z', 'Cierra a las 13:01', 'Cierra 13:01'],
      [
        'closing after midnight (says "mañana")',
        new Date('2026-11-17T02:00:00Z'),
        '2026-11-17T05:00:00Z',
        'Cierra mañana a las 02:00',
        'Cierra mañana 02:00',
      ],
      [
        'closing at 00:00 (never 24:00)',
        new Date('2026-11-17T00:00:00Z'),
        '2026-11-17T03:00:00Z',
        'Cierra mañana a las 00:00',
        'Cierra mañana 00:00',
      ],
      [
        'closing tomorrow later than the current hour',
        NOW,
        '2026-11-19T01:00:00Z',
        'Cierra mañana a las 22:00',
        'Cierra mañana 22:00',
      ],
      [
        'closing tomorrow earlier than the current hour',
        NOW,
        '2026-11-18T14:00:00Z',
        'Cierra mañana a las 11:00',
        'Cierra mañana 11:00',
      ],
      [
        'closing in 3 days',
        NOW,
        '2026-11-20T15:00:00Z',
        'Cierra el viernes a las 12:00',
        'Cierra viernes 12:00',
      ],
    ])('does not emphasize when %s', (_name, now, closesAt, text, shortText) => {
      expect(statusText(at('open', closesAt, null), now, LOCALITY_TIME_ZONE)).toEqual({
        text,
        shortText,
        emphasized: false,
      });
    });

    it.each([
      ['no closing time', null],
      ['closing time equal to now', '2026-11-17T15:00:00Z'],
      ['closing time in the past (stale response)', '2026-11-17T14:00:00Z'],
    ])('has no line with %s', (_name, closesAt) => {
      expect(statusText(at('open', closesAt, null), NOW, LOCALITY_TIME_ZONE)).toBeNull();
    });

    it('names the weekday of a closing 7 or more days away', () => {
      expect(statusText(at('open', '2026-11-24T12:00:00Z', null), NOW, LOCALITY_TIME_ZONE)).toEqual(
        {
          text: 'Cierra el próximo martes a las 09:00',
          shortText: 'Cierra próximo martes 09:00',
          emphasized: false,
        },
      );
    });
  });

  describe('closed', () => {
    it('emphasizes an opening in 20 minutes', () => {
      expect(
        statusText(at('closed', null, '2026-11-17T15:20:00Z'), NOW, LOCALITY_TIME_ZONE),
      ).toEqual({
        text: 'Abre en 20 min · 12:20',
        shortText: 'Abre en 20 min',
        emphasized: true,
      });
    });

    it.each([
      ['in 61 minutes (not soon)', '2026-11-17T16:01:00Z', 'Abre a las 13:01', 'Abre 13:01'],
      ['later today', '2026-11-17T21:00:00Z', 'Abre a las 18:00', 'Abre 18:00'],
      ['tomorrow', '2026-11-18T12:00:00Z', 'Abre mañana a las 09:00', 'Abre mañana 09:00'],
      ['in 3 days', '2026-11-20T12:00:00Z', 'Abre el viernes a las 09:00', 'Abre viernes 09:00'],
      [
        'in 7 days',
        '2026-11-24T12:00:00Z',
        'Abre el próximo martes a las 09:00',
        'Abre próximo martes 09:00',
      ],
    ])('says when it opens %s', (_name, nextOpeningAt, text, shortText) => {
      expect(statusText(at('closed', null, nextOpeningAt), NOW, LOCALITY_TIME_ZONE)).toEqual({
        text,
        shortText,
        emphasized: false,
      });
    });

    it('has no line without a next opening', () => {
      expect(statusText(at('closed', null, null), NOW, LOCALITY_TIME_ZONE)).toBeNull();
    });

    it('uses the local calendar day, not the UTC one', () => {
      // 22:00 del lunes local ya es el martes en UTC; la apertura es martes 09:00 local.
      const now = new Date('2026-11-17T01:00:00Z');
      expect(
        statusText(at('closed', null, '2026-11-17T12:00:00Z'), now, LOCALITY_TIME_ZONE),
      ).toEqual({
        text: 'Abre mañana a las 09:00',
        shortText: 'Abre mañana 09:00',
        emphasized: false,
      });
    });
  });

  describe('closed_today', () => {
    it.each([
      [
        'tomorrow',
        '2026-11-18T12:00:00Z',
        'Hoy no abre. Vuelve mañana a las 09:00',
        'Vuelve mañana 09:00',
      ],
      [
        'another day',
        '2026-11-20T12:00:00Z',
        'Hoy no abre. Vuelve el viernes a las 09:00',
        'Vuelve viernes 09:00',
      ],
      [
        'in 7 days',
        '2026-11-24T12:00:00Z',
        'Hoy no abre. Vuelve el próximo martes a las 09:00',
        'Vuelve próximo martes 09:00',
      ],
      ['the same day (unexpected)', '2026-11-17T15:40:00Z', 'Vuelve a las 12:40', 'Vuelve 12:40'],
    ])(
      'says when it returns %s, never "en N min" nor emphasized',
      (_name, next, text, shortText) => {
        expect(statusText(at('closed_today', null, next), NOW, LOCALITY_TIME_ZONE)).toEqual({
          text,
          shortText,
          emphasized: false,
        });
      },
    );

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
