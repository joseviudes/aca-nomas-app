// Slug del negocio (RN-05): se genera del nombre al crear la ficha (US-15) y nunca cambia, aunque
// el dueño edite el nombre. Funciones puras: quien crea la ficha le pasa los slugs que ya existen.

// Para un nombre sin letras ni números ("¡¡!!"), que daría un slug vacío.
export const FALLBACK_SLUG = 'negocio';

// "Panadería La Espiga" → "panaderia-la-espiga". Saca las tildes (también la de la ñ), pasa a
// minúsculas y une las palabras con un guion, como los slugs del seed.
export function toSlug(name: string): string {
  const slug = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    // "Pepe's" queda "pepes", no "pepe-s".
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || FALLBACK_SLUG;
}

// Si el slug ya existe, le suma un número: "kiosco-la-esquina-2", "kiosco-la-esquina-3"…
export function toUniqueSlug(name: string, takenSlugs: ReadonlySet<string>): string {
  const base = toSlug(name);
  if (!takenSlugs.has(base)) return base;

  let suffix = 2;
  while (takenSlugs.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}
