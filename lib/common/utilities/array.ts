export function arrayUnion<T>(set1: T[], set2: T[]): T[] {
  const result = [...set1]

  for (const key of set2) {
    if (!result.includes(key)) {
      result.push(key)
    }
  }

  return result
}

export function arrayDifference<T>(set1: T[], set2: T[]): T[] {
  const result: T[] = []

  for (const key of set1) {
    if (!set2.includes(key)) {
      result.push(key)
    }
  }

  return result
}
