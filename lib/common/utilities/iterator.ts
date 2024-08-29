import { oneIn } from '../core/rand'

export function getRandom<T>(iter: Iterable<T>, fn: (obj: T) => boolean): T | undefined {
  let count = 1
  let found: T | undefined
  for (const obj of iter) {
    if (fn(obj)) {
      if (oneIn(count)) found = obj
      count++
    }
  }

  return found
}
