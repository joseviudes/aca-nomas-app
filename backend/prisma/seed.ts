// Datos ficticios para desarrollo. Se corre con `npm run db:seed` y se puede repetir:
// borra todo y vuelve a cargar, así la base siempre queda igual.
// Cada negocio cubre un caso que el código tiene que resolver (turno partido, medianoche, pausa…).

import bcrypt from 'bcrypt';
import { env } from '../src/config/env.js';
import type { Prisma } from '../src/generated/prisma/client.js';
import { prisma } from '../src/infrastructure/database/prisma.js';
import {
  paymentMethodsSchema,
  type PaymentMethod,
} from '../src/modules/businesses/schemas/business.schema.js';

// Contraseña de todas las cuentas del seed. Es pública a propósito: solo existe en la base local.
const SEED_PASSWORD = 'acanomas123';

// Los tipos TIME de PostgreSQL llegan a Prisma como Date: solo importa la hora.
const time = (hhmm: string): Date => new Date(`1970-01-01T${hhmm}:00Z`);

type Shift = [opensAt: string, closesAt: string];

// days: 1 es lunes y 7 es domingo. El turno pertenece al día en que empieza (RN-02).
function shifts(
  days: number[],
  ...ranges: Shift[]
): Prisma.OpeningHourCreateWithoutBusinessInput[] {
  return days.flatMap((dayOfWeek) =>
    ranges.map(([opensAt, closesAt]) => ({
      dayOfWeek,
      opensAt: time(opensAt),
      closesAt: time(closesAt),
    })),
  );
}

const MON_TO_FRI = [1, 2, 3, 4, 5];
const MON_TO_SAT = [1, 2, 3, 4, 5, 6];
const EVERY_DAY = [1, 2, 3, 4, 5, 6, 7];

const CATEGORIES = [
  { name: 'Panadería', slug: 'panaderia' },
  { name: 'Almacén', slug: 'almacen' },
  { name: 'Farmacia', slug: 'farmacia' },
  { name: 'Rotisería', slug: 'rotiseria' },
  { name: 'Kiosco', slug: 'kiosco' },
  { name: 'Ferretería', slug: 'ferreteria' },
  { name: 'Verdulería', slug: 'verduleria' },
  { name: 'Peluquería', slug: 'peluqueria' },
  { name: 'Cafetería', slug: 'cafeteria' },
  { name: 'Bicicletería', slug: 'bicicleteria' },
] as const;

type CategorySlug = (typeof CATEGORIES)[number]['slug'];

interface SeedBusiness {
  name: string;
  slug: string;
  category: CategorySlug;
  description?: string;
  coordinates?: [latitude: number, longitude: number];
  paymentMethods: PaymentMethod[];
  offersDelivery?: boolean;
  isPaused?: boolean;
  openingHours: Prisma.OpeningHourCreateWithoutBusinessInput[];
  contactChannels: Prisma.ContactChannelCreateWithoutBusinessInput[];
}

// Coordenadas alrededor del centro de Corrientes Capital.
const BUSINESSES: SeedBusiness[] = [
  {
    name: 'Panadería La Espiga',
    slug: 'panaderia-la-espiga',
    category: 'panaderia',
    description: 'Pan casero, facturas y tortas por encargo.',
    coordinates: [-27.4692, -58.8306],
    paymentMethods: ['cash', 'transfer'],
    // Caso: turno partido (mañana y tarde) y horario distinto el domingo.
    openingHours: [
      ...shifts(MON_TO_SAT, ['07:00', '13:00'], ['17:00', '21:00']),
      ...shifts([7], ['07:00', '12:00']),
    ],
    contactChannels: [
      { type: 'whatsapp', value: '5493794000001' },
      { type: 'instagram', value: 'laespiga.ctes' },
    ],
  },
  {
    name: 'Almacén Don Pedro',
    slug: 'almacen-don-pedro',
    category: 'almacen',
    description: 'Almacén de barrio con fiambrería y bebidas.',
    coordinates: [-27.4731, -58.8352],
    paymentMethods: ['cash', 'transfer', 'card', 'mercado_pago'],
    offersDelivery: true,
    // Caso: horario corrido todos los días.
    openingHours: shifts(EVERY_DAY, ['08:00', '22:00']),
    contactChannels: [{ type: 'whatsapp', value: '5493794000002' }],
  },
  {
    name: 'Farmacia del Centro',
    slug: 'farmacia-del-centro',
    category: 'farmacia',
    description: 'Medicamentos, perfumería y obras sociales.',
    coordinates: [-27.4668, -58.8297],
    paymentMethods: ['cash', 'card', 'mercado_pago'],
    offersDelivery: true,
    // Caso: el sábado abre solo a la mañana y el domingo no abre.
    openingHours: [...shifts(MON_TO_FRI, ['08:00', '20:00']), ...shifts([6], ['09:00', '13:00'])],
    contactChannels: [
      { type: 'whatsapp', value: '5493794000003' },
      { type: 'instagram', value: 'farmaciadelcentro' },
    ],
  },
  {
    name: 'Rotisería El Fogón',
    slug: 'rotiseria-el-fogon',
    category: 'rotiseria',
    description: 'Empanadas, pizzas y minutas para llevar.',
    coordinates: [-27.4755, -58.8271],
    paymentMethods: ['cash', 'mercado_pago'],
    offersDelivery: true,
    // Caso: turno que cruza la medianoche (19:00 a 01:00) y el lunes cerrado.
    openingHours: shifts([2, 3, 4, 5, 6, 7], ['19:00', '01:00']),
    contactChannels: [
      { type: 'whatsapp', value: '5493794000004' },
      { type: 'instagram', value: 'elfogon.rotiseria' },
    ],
  },
  {
    name: 'Kiosco La Esquina',
    slug: 'kiosco-la-esquina',
    category: 'kiosco',
    coordinates: [-27.4709, -58.8389],
    paymentMethods: ['cash', 'transfer'],
    // Caso: sin descripción y cierre con minutos (23:30).
    openingHours: shifts(EVERY_DAY, ['07:00', '23:30']),
    contactChannels: [{ type: 'whatsapp', value: '5493794000005' }],
  },
  {
    name: 'Ferretería El Tornillo',
    slug: 'ferreteria-el-tornillo',
    category: 'ferreteria',
    description: 'Herramientas, pinturas y materiales eléctricos.',
    coordinates: [-27.4783, -58.8324],
    paymentMethods: ['cash', 'card'],
    // Caso: pausado por vacaciones (RN-01). Tiene horarios, pero se muestra cerrado.
    isPaused: true,
    openingHours: [
      ...shifts(MON_TO_FRI, ['08:00', '12:30'], ['16:00', '20:00']),
      ...shifts([6], ['08:00', '12:30']),
    ],
    contactChannels: [{ type: 'whatsapp', value: '5493794000006' }],
  },
  {
    name: 'Verdulería Los Naranjos',
    slug: 'verduleria-los-naranjos',
    category: 'verduleria',
    description: 'Frutas y verduras frescas de productores de la zona.',
    coordinates: [-27.4647, -58.8361],
    paymentMethods: ['cash', 'transfer', 'mercado_pago'],
    offersDelivery: true,
    openingHours: shifts(MON_TO_SAT, ['07:30', '13:00'], ['17:00', '20:30']),
    // Caso: el WhatsApp está cargado pero oculto (RN-06): no sale en la API pública.
    contactChannels: [
      { type: 'whatsapp', value: '5493794000007', isPublic: false },
      { type: 'instagram', value: 'losnaranjos.verdu' },
    ],
  },
  {
    name: 'Peluquería Estilo',
    slug: 'peluqueria-estilo',
    category: 'peluqueria',
    description: 'Cortes, color y peinados. Atención con turno.',
    coordinates: [-27.4721, -58.8258],
    paymentMethods: ['cash', 'transfer'],
    openingHours: shifts([2, 3, 4, 5, 6], ['09:00', '19:00']),
    // Caso: solo Instagram, sin WhatsApp.
    contactChannels: [{ type: 'instagram', value: 'estilo.peluqueria' }],
  },
  {
    name: 'Café del Puerto',
    slug: 'cafe-del-puerto',
    category: 'cafeteria',
    description: 'Café de especialidad frente a la costanera.',
    coordinates: [-27.4612, -58.8329],
    paymentMethods: ['cash', 'card', 'mercado_pago'],
    // Casos: cierre justo a la medianoche (00:00) de lunes a jueves, y pasada la medianoche
    // los viernes y sábados.
    openingHours: [
      ...shifts([1, 2, 3, 4], ['08:00', '00:00']),
      ...shifts([5, 6], ['08:00', '02:00']),
    ],
    contactChannels: [
      { type: 'whatsapp', value: '5493794000009' },
      { type: 'instagram', value: 'cafedelpuerto' },
    ],
  },
  {
    name: 'Bicicletería Rueda Libre',
    slug: 'bicicleteria-rueda-libre',
    category: 'bicicleteria',
    description: 'Reparación y repuestos de bicicletas.',
    paymentMethods: [],
    // Casos: sin horarios cargados (RN-03: cerrado todos los días), sin ubicación,
    // sin medios de pago y sin canales de contacto.
    openingHours: [],
    contactChannels: [],
  },
];

async function main(): Promise<void> {
  if (env.NODE_ENV === 'production') {
    throw new Error('El seed carga datos ficticios: no se corre en producción.');
  }

  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

  await prisma.$transaction(async (tx) => {
    // Orden inverso a las dependencias: los turnos y canales se borran en cascada con su negocio.
    await tx.business.deleteMany();
    await tx.user.deleteMany();
    await tx.category.deleteMany();
    await tx.locality.deleteMany();

    const locality = await tx.locality.create({
      data: { name: 'Corrientes Capital', timezone: 'America/Argentina/Buenos_Aires' },
    });

    const categoryIds = new Map<string, string>();
    for (const category of CATEGORIES) {
      const created = await tx.category.create({ data: category });
      categoryIds.set(category.slug, created.id);
    }

    await tx.user.create({
      data: { email: 'admin@example.com', passwordHash, role: 'admin' },
    });

    // Un dueño por negocio: el MVP muestra un negocio por dueño (D-20).
    for (const [index, business] of BUSINESSES.entries()) {
      const [latitude, longitude] = business.coordinates ?? [null, null];

      await tx.business.create({
        data: {
          name: business.name,
          slug: business.slug,
          description: business.description,
          latitude,
          longitude,
          // Misma validación que va a usar la API antes de guardar (D-22).
          paymentMethods: paymentMethodsSchema.parse(business.paymentMethods),
          offersDelivery: business.offersDelivery ?? false,
          isPaused: business.isPaused ?? false,
          owner: {
            create: { email: `owner${index + 1}@example.com`, passwordHash, role: 'owner' },
          },
          locality: { connect: { id: locality.id } },
          category: { connect: { id: categoryIds.get(business.category) } },
          openingHours: { create: business.openingHours },
          contactChannels: { create: business.contactChannels },
        },
      });
    }
  });

  console.log(
    `Seed listo: 1 localidad, ${CATEGORIES.length} rubros, ${BUSINESSES.length} negocios y ${BUSINESSES.length + 1} usuarios.`,
  );
  console.log(
    `Cuentas: admin@example.com y owner1@example.com a owner${BUSINESSES.length}@example.com, contraseña "${SEED_PASSWORD}".`,
  );
}

void main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
