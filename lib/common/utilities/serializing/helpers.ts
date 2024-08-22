import { JsonObject } from '../json'

export function ifExists<T, U>(obj: T | undefined, serializer: (obj: T) => U): U | undefined {
  return obj == null ? undefined : serializer(obj)
}
