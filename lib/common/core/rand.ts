const MAX_RAND_DEPTH = 128

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

export function randEl<T>(ary: T[]): T {
  return ary[randInt0(ary.length)]
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

export function mBonus(max: number, level: number) {
  if (level >= MAX_RAND_DEPTH) level = MAX_RAND_DEPTH - 1

  const bonus = simulateDivision(max * level, MAX_RAND_DEPTH)
  const sd = simulateDivision(max, 4)
  const value = randNormal(bonus, sd)

  if (value < 0) {
    return 0
  } else if (value > max) {
    return max
  }

  return value
}

function simulateDivision(dividend: number, divisor: number) {
  let quotient = Math.trunc(dividend / divisor)
  const remainder = dividend % divisor
  if (randInt0(divisor) < remainder) quotient++
  return quotient
}


// 8 * 8 * 4 = 256 entries
const RAND_NORMAL_LENGTH = 256
const RAND_NORMAL_SD = 64
const RAND_NORMAL_TABLE = [
  206,   613,   1022,  1430,  1838,  2245,  2652,  3058,
  3463,  3867,  4271,  4673,  5075,  5475,  5874,  6271,
  6667,  7061,  7454,  7845,  8234,  8621,  9006,  9389,
  9770,  10148, 10524, 10898, 11269, 11638, 12004, 12367,
  12727, 13085, 13440, 13792, 14140, 14486, 14828, 15168,
  15504, 15836, 16166, 16492, 16814, 17133, 17449, 17761,
  18069, 18374, 18675, 18972, 19266, 19556, 19842, 20124,
  20403, 20678, 20949, 21216, 21479, 21738, 21994, 22245,

  22493, 22737, 22977, 23213, 23446, 23674, 23899, 24120,
  24336, 24550, 24759, 24965, 25166, 25365, 25559, 25750,
  25937, 26120, 26300, 26476, 26649, 26818, 26983, 27146,
  27304, 27460, 27612, 27760, 27906, 28048, 28187, 28323,
  28455, 28585, 28711, 28835, 28955, 29073, 29188, 29299,
  29409, 29515, 29619, 29720, 29818, 29914, 30007, 30098,
  30186, 30272, 30356, 30437, 30516, 30593, 30668, 30740,
  30810, 30879, 30945, 31010, 31072, 31133, 31192, 31249,

  31304, 31358, 31410, 31460, 31509, 31556, 31601, 31646,
  31688, 31730, 31770, 31808, 31846, 31882, 31917, 31950,
  31983, 32014, 32044, 32074, 32102, 32129, 32155, 32180,
  32205, 32228, 32251, 32273, 32294, 32314, 32333, 32352,
  32370, 32387, 32404, 32420, 32435, 32450, 32464, 32477,
  32490, 32503, 32515, 32526, 32537, 32548, 32558, 32568,
  32577, 32586, 32595, 32603, 32611, 32618, 32625, 32632,
  32639, 32645, 32651, 32657, 32662, 32667, 32672, 32677,

  32682, 32686, 32690, 32694, 32698, 32702, 32705, 32708,
  32711, 32714, 32717, 32720, 32722, 32725, 32727, 32729,
  32731, 32733, 32735, 32737, 32739, 32740, 32742, 32743,
  32745, 32746, 32747, 32748, 32749, 32750, 32751, 32752,
  32753, 32754, 32755, 32756, 32757, 32757, 32758, 32758,
  32759, 32760, 32760, 32761, 32761, 32761, 32762, 32762,
  32763, 32763, 32763, 32764, 32764, 32764, 32764, 32765,
  32765, 32765, 32765, 32766, 32766, 32766, 32766, 32767,
] as const

function randNormal(mean: number, sd: number) {
  let low = 0
  let high = RAND_NORMAL_LENGTH

  if (sd < 1) return mean

  const tmp = randInt0(32768)

  while (low < high) {
    const mid = (low + high) >> 1

    if (RAND_NORMAL_TABLE[mid] < tmp) {
      low = mid + 1
    } else {
      high = mid
    }
  }

  const offset = Math.trunc((sd * low) / RAND_NORMAL_SD)

  return oneIn(2) ? mean - offset : mean + offset
}
