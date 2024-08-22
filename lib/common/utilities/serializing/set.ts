export function setToJson<T>(set: Set<T>): T[] | undefined {
  return set.size === 0 ? undefined : Array.from(set)
}
