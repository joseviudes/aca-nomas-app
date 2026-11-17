// La página va en ?pagina= (D-29). La primera queda en "/", sin parámetro.
export function pageHref(page: number): string {
  return page <= 1 ? '/' : `/?pagina=${page}`;
}
