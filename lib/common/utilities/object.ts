export type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

export type ValuesOfType<T extends Record<string, any>, U> = T[keyof T] extends U ? T[keyof T] : never
