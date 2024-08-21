export type NativeEnum = Record<string, string | number>

export type EnumValueOnly<T> = T[keyof T] extends number ? T[keyof T] : never

export function enumToKeyArray<T extends NativeEnum>(enumObject: T): (keyof T)[] {
  const results: (keyof T)[] = []
  for (const [k, v] of Object.entries(enumObject)) {
    if (typeof v === 'number') {
      results.push(k)
    }
  }

  return results
}

export function enumValueToKey<T extends NativeEnum>(value: number | undefined, enumObject: T): keyof T | undefined {
  for (const [k, v] of Object.entries(enumObject)) {
    if (v === value) return k
  }

  return undefined
}

export function enumValueToKeyOrThrow<T extends NativeEnum>(value: number | undefined, enumObject: T): keyof T {
  const result = enumValueToKey(value, enumObject)
  if (result) return result
  throw new Error('key not found in enum')
}

export function enumValueSetToArray<T extends NativeEnum>(set: Set<T[keyof T]>, enumObject: T): Array<keyof T> | undefined {
  if (set.size === 0) return

  const results: Array<keyof T> = []

  const objectEntries = Object.entries(enumObject).filter(valueIsNumeric)

  for (const value of set.keys()) {
    for (const [k, v] of objectEntries) {
      if (v === value) results.push(k)
    }
  }

  return results
}

function valueIsNumeric(param: [string, string | number]): param is [string, number] {
  return typeof param[1] === 'number'
}
