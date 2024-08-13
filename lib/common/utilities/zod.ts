import { z } from 'zod'

// Converts a plain object's keys into ZodEnum with type safety and
// autocompletion
export function z_enumFromObject<
  T extends Record<string, any>, R extends string = T extends Record<infer R, any> ? R : never
>(input: T): z.ZodEnum<[R, ...R[]]> {
    const [firstKey, ...otherKeys] = Object.keys(input) as [R, ...R[]];
    return z.enum([firstKey, ...otherKeys]);
}
