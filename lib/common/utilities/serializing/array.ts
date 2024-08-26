export function onlyIfNonEmpty<T>(ary: T[]): T[] | undefined {
  return ary.length === 0 ? undefined : ary
}
