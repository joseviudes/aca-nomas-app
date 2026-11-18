// Textos que arma el listado a partir de los datos de la API (docs/diseno.md).

// La inicial ocupa el lugar de la foto que falta. Array.from separa por carácter y no por
// unidad de UTF-16, así una letra fuera del plano básico no queda cortada a la mitad.
export function businessInitial(name: string): string {
  const [first = ''] = Array.from(name.trim());
  return first.toLocaleUpperCase('es');
}

export function businessCountLabel(total: number): string {
  return total === 1 ? '1 negocio' : `${total} negocios`;
}
