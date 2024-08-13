export function arrayUnion<T>(set1: T[], set2: T[]) {
  const result = [...set1]

  for (const key of set2) {
    if (!result.includes(key)) {
      result.push(key)
    }
  }

  return result
}
