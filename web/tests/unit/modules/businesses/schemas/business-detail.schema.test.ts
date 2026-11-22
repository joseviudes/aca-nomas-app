import { describe, expect, it } from 'vitest';
import { businessDetailFixture } from '@/modules/businesses/api/businesses.fixtures';
import { businessDetailSchema } from '@/modules/businesses/schemas/business-detail.schema';

// El ejemplo de Swagger (backend/src/modules/businesses/schemas/business.schema.ts).
const swaggerExample = {
  slug: 'panaderia-la-espiga',
  name: 'Panadería La Espiga',
  description: 'Pan casero, facturas y tortas por encargo.',
  category: { slug: 'panaderia', name: 'Panadería' },
  photoUrl: null,
  status: { state: 'open', closesAt: '2026-11-17T23:00:00.000Z', nextOpeningAt: null },
  schedule: {
    timezone: 'America/Argentina/Buenos_Aires',
    today: 2,
    days: [
      { dayOfWeek: 1, shifts: [{ opensAt: '08:00', closesAt: '20:00' }] },
      { dayOfWeek: 2, shifts: [{ opensAt: '08:00', closesAt: '20:00' }] },
      { dayOfWeek: 3, shifts: [{ opensAt: '08:00', closesAt: '20:00' }] },
      { dayOfWeek: 4, shifts: [{ opensAt: '08:00', closesAt: '20:00' }] },
      { dayOfWeek: 5, shifts: [{ opensAt: '08:00', closesAt: '20:00' }] },
      { dayOfWeek: 6, shifts: [{ opensAt: '09:00', closesAt: '13:00' }] },
      { dayOfWeek: 7, shifts: [] },
    ],
  },
};

function withSchedule(schedule: Partial<typeof swaggerExample.schedule>) {
  return { ...swaggerExample, schedule: { ...swaggerExample.schedule, ...schedule } };
}

function withMondayShift(shift: { opensAt: string; closesAt: string }) {
  const [, ...rest] = swaggerExample.schedule.days;
  return withSchedule({ days: [{ dayOfWeek: 1, shifts: [shift] }, ...rest] });
}

describe('businessDetailSchema', () => {
  it('accepts the Swagger example', () => {
    expect(businessDetailSchema.parse(swaggerExample)).toEqual(swaggerExample);
  });

  it.each(['kiosco-el-recreo', 'peluqueria-tijeras', 'verduleria-campo-fresco'])(
    'accepts the %s fixture',
    (slug) => {
      expect(businessDetailSchema.safeParse(businessDetailFixture(slug)).success).toBe(true);
    },
  );

  it('accepts a business without description', () => {
    expect(businessDetailSchema.safeParse({ ...swaggerExample, description: null }).success).toBe(
      true,
    );
  });

  it('accepts a photo URL', () => {
    const withPhoto = { ...swaggerExample, photoUrl: 'https://example.com/foto.jpg' };
    expect(businessDetailSchema.safeParse(withPhoto).success).toBe(true);
  });

  it('accepts a shift that crosses midnight', () => {
    const overnight = withMondayShift({ opensAt: '19:00', closesAt: '01:00' });
    expect(businessDetailSchema.safeParse(overnight).success).toBe(true);
  });

  it('rejects a description longer than 80 characters', () => {
    const tooLong = { ...swaggerExample, description: 'a'.repeat(81) };
    expect(businessDetailSchema.safeParse(tooLong).success).toBe(false);
  });

  it('rejects a photoUrl that is not a URL', () => {
    expect(businessDetailSchema.safeParse({ ...swaggerExample, photoUrl: 'foto' }).success).toBe(
      false,
    );
  });

  it.each(['slug', 'name', 'category', 'status', 'schedule'])(
    'rejects a response without %s',
    (field) => {
      const incomplete = Object.fromEntries(
        Object.entries(swaggerExample).filter(([key]) => key !== field),
      );
      expect(businessDetailSchema.safeParse(incomplete).success).toBe(false);
    },
  );

  it('rejects an unknown state', () => {
    const unknown = { ...swaggerExample, status: { ...swaggerExample.status, state: 'busy' } };
    expect(businessDetailSchema.safeParse(unknown).success).toBe(false);
  });

  it('rejects a week of 6 days', () => {
    const sixDays = withSchedule({ days: swaggerExample.schedule.days.slice(0, 6) });
    expect(businessDetailSchema.safeParse(sixDays).success).toBe(false);
  });

  it.each(['24:00', '8:00', '08:60'])('rejects the hour %s', (hour) => {
    const invalid = withMondayShift({ opensAt: hour, closesAt: '20:00' });
    expect(businessDetailSchema.safeParse(invalid).success).toBe(false);
  });

  it.each([0, 8])('rejects today = %i', (today) => {
    expect(businessDetailSchema.safeParse(withSchedule({ today })).success).toBe(false);
  });

  // Los campos que sumen US-10 y US-17 no rompen la ficha antes de que la web los use.
  it('drops unknown fields without failing', () => {
    const withExtra = { ...swaggerExample, channels: [{ type: 'whatsapp' }] };
    expect(businessDetailSchema.parse(withExtra)).toEqual(swaggerExample);
  });
});
