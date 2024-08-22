export type NativeEnum = Record<string, string | number>
export type EnumValueOnly<T> = T[keyof T] extends number ? T[keyof T] : never
