import { z } from 'zod'
import { enumValueToKey, NativeEnum } from './enum'
import { stringToDice } from './dice'
import { EX } from '../spells/expressions'
import { EF } from '../spells/effects'

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

export type CombatJSON = z.input<typeof z_combat>
export type CombatParams = z.output<typeof z_combat>

export function combatToJson(combat: CombatParams): CombatJSON {
  return {
    toHit: combat.toHit.toString(),
    toDamage: combat.toDamage.toString(),
    toAC: combat.toAC.toString(),
  }
}

export const z_effect = z.object({
  effect: z_enumValueParser(EF)
})

export type zEffectJSON = z.input<typeof z_effect>
export type zEffectParams = z.output<typeof z_effect>

export function effectToJson(effect: zEffectParams): zEffectJSON {
  return {
    effect: enumValueToKey(effect.effect, EF)
  }
}

export const z_expression = z.object({
  variable: z.string(),
  type: z_enumValueParser(EX), // TODO: Where does this come from? validate
  expression: z.string(), // basically a function of the previous two
})

export type zExpressionJSON = z.input<typeof z_expression>
export type zExpressionParams = z.output<typeof z_expression>
