import { z } from 'zod'
import { NativeEnum } from './enum'
import { stringToDice } from './dice'

/*
 * Converts a plain object's keys into ZodEnum with type safety and
 * autocompletion
 */
export function z_enumFromObject<
  T extends Record<string, any>,
  R extends string = T extends Record<infer R, any> ? R : never
>(input: T): z.ZodEnum<[R, ...R[]]> {
    const [firstKey, ...otherKeys] = Object.keys(input) as [R, ...R[]]
    return z.enum([firstKey, ...otherKeys])
}

/*
 * returns a transformer that converts provided keys to values
 */
export function z_enumValueParser<
  T extends NativeEnum,
  R extends string = T extends Record<infer R, any> ? R : never
>(enumObj: T) {
  const keys = Object.keys(enumObj) as [R, ...R[]]
  const keySchema = z.enum(keys)

  return keySchema.transform((key) => enumObj[key as R] as T[keyof T]);
}

export function z_diceExpression() {
  return z.string().transform((str: string, ctx: z.RefinementCtx) => {
    try {
      return stringToDice(str)
    } catch (e) {
      // TODO: what's the expression?
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'invalid dice expression'
      })

      return z.NEVER
    }
  })
}

export const z_combat = z.object({
  toHit: z_diceExpression(),
  toDamage: z_diceExpression(),
  toAC: z_diceExpression(),
})

export type Combat = z.output<typeof z_combat>
