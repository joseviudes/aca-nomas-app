// Textos que arman el listado y la ficha a partir de los datos de la API (docs/diseno.md).

// La inicial ocupa el lugar de la foto que falta. Array.from separa por carácter y no por
// unidad de UTF-16, así una letra fuera del plano básico no queda cortada a la mitad.
export function businessInitial(name: string): string {
  const [first = ''] = Array.from(name.trim());
  return first.toLocaleUpperCase('es');
}

export function businessCountLabel(total: number): string {
  return total === 1 ? '1 negocio' : `${total} negocios`;
}

// Ruta de la ficha (D-29). Se codifica el slug para que un carácter raro no arme otra ruta.
export function businessDetailPath(slug: string): string {
  return `/negocios/${encodeURIComponent(slug)}`;
}

// Título y descripción de la vista previa al compartir la ficha (D-27). Sin descripción propia
// no se inventa una: la vista previa muestra solo el título.
export function businessShareTexts(business: { name: string; description: string | null }): {
  title: string;
  description: string | undefined;
} {
  return {
    title: `${business.name} | AcáNomás`,
    description: business.description ?? undefined,
  };
}
