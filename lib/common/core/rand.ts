// TODO: repeated seed; port z-rand
export function randInt0(number: number): number {
  if (number <= 0) throw new Error('range error')
  return Math.floor(Math.random() * number)
}

export function randInt1(number: number): number {
  if (number <= 0) throw new Error('range error')
  return Math.floor(Math.random() * number) + 1
}

export function oneIn(number: number): boolean {
  if (number <= 0) throw new Error('range error')
  return randInt0(number) === 0
}

/*
 * rand between lower and upper, inclusive
 */
export function randInRange(lower: number, upper: number) {
  if (lower === upper) return lower
  const min = Math.min(lower, upper)
  const max = Math.max(lower, upper)
  return min + randInt0(1 + max - min)
}

/*
 * two-pass random object selector that is always guaranteed to return a value
 *
 * partition the objects into N buckets marked by the running sum; roll dice;
 * find the first object from the end whose running sum is greater than the dice
 * roll
 *
 * range of running sum: 1 to X
 * range of dice roll: 0 to X - 1
 */
export function findByAlloc<T extends string, U extends { [key in T]: number }>(
  key: T,
  iterable: Iterable<U>
): U {
  let runningDenominator = 0
  const rangeMap: [number, U][] = []
  for (const obj of iterable) {
    const value = obj[key]
    if (value <= 0) continue
    runningDenominator += value
    rangeMap.push([runningDenominator, obj])
  }

  if (rangeMap.length === 0) {
    throw new Error('invalid allocations iterable')
  }

  const randValue = randInt0(runningDenominator)
  const len = rangeMap.length

  for (let i = len - 1; i >= 0; i--) {
    const [denominator, obj] = rangeMap[i]
    if (denominator < randValue) return obj
  }

  throw new Error('fell through allocation finder')
}
