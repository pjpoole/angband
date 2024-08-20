export type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

export type ValuesOfType<T extends Record<string, any>, U> = T[keyof T] extends U ? T[keyof T] : never

export function objectValueToKey<T extends Record<string, any>>(value: any, obj: T): keyof T | undefined {
  for (const [k, v] of Object.entries(obj)) {
    if (v === value) return k
  }

  return undefined
}
