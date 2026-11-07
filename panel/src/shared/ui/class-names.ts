// Une clases de Tailwind y descarta las vacías: cx('a', cond && 'b', undefined) → 'a b'.
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
