import type { BusinessDetail } from '../schemas/business-detail.schema';

// Fichas de ejemplo con la forma del contrato (D-40). La primera es el ejemplo de Swagger; la
// segunda cubre un negocio sin descripción. Nombres inventados.
const BUSINESS_DETAILS: BusinessDetail[] = [
  {
    slug: 'panaderia-la-espiga',
    name: 'Panadería La Espiga',
    description: 'Pan casero, facturas y tortas por encargo.',
    category: { slug: 'panaderia', name: 'Panadería' },
    photoUrl: null,
  },
  {
    slug: 'kiosco-el-recreo',
    name: 'Kiosco El Recreo',
    description: null,
    category: { slug: 'kiosco', name: 'Kiosco' },
    photoUrl: null,
  },
];

// undefined es un negocio que no existe: la API responde 404.
export function businessDetailFixture(slug: string): BusinessDetail | undefined {
  return BUSINESS_DETAILS.find((business) => business.slug === slug);
}
