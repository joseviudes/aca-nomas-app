// Única forma de armar una URL del listado, así la paginación, "Reintentar" y los estados vacíos
// conservan el rubro. Los parámetros van en español (D-44, opción A): ?rubro= y ?pagina=. La
// primera página y "Todo" no llevan parámetro: el listado completo queda en "/".
export function listHref({
  page = 1,
  category,
}: { page?: number; category?: string } = {}): string {
  const params = new URLSearchParams();
  if (category) params.set('rubro', category);
  if (page > 1) params.set('pagina', String(page));

  const query = params.toString();
  return query ? `/?${query}` : '/';
}
