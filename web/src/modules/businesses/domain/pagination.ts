// Lo que la API devuelve junto con cada página (D-25).
type PageInfo = { page: number; limit: number; total: number };

export function totalPages({ limit, total }: Pick<PageInfo, 'limit' | 'total'>): number {
  return Math.ceil(total / limit);
}

export function hasPreviousPage({ page }: Pick<PageInfo, 'page'>): boolean {
  return page > 1;
}

export function hasNextPage(info: PageInfo): boolean {
  return info.page < totalPages(info);
}

// La página va en ?pagina= (D-44). La primera queda en "/", sin parámetro.
export function pageHref(page: number): string {
  return page <= 1 ? '/' : `/?pagina=${page}`;
}
