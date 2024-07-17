export function setDifference<T>(set1: Set<T>, set2: Set<T>): Set<T> {
  const result: Set<T> = new Set()
  for (const key of set1.keys()) {
    if (!set2.has(key)) result.add(key)
  }

  return result
}

export function setUnion<T>(set1: Set<T>, set2: Set<T>): Set<T> {
  const result = new Set(set1)

  for (const key of set2.keys()) {
    result.add(key)
  }

  return result
}
