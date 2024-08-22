import { z } from 'zod'
import { enumValueToKey } from './enum'
import { stringToDice } from './dice'
import { EX } from '../spells/expressions'
import { EF } from '../spells/effects'
import { z_enumValueParser } from './zod/enums'

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

export function combatToJson(combat?: CombatParams): CombatJSON | undefined {
  return combat == null ? undefined : {
    toHit: combat.toHit.toString(),
    toDamage: combat.toDamage.toString(),
    toAC: combat.toAC.toString(),
  }
}

export const z_skill = z.object({
  device: z.number().optional(),
  dig: z.number().optional(),
  disarm: z.number().optional(),
  disarmMagic: z.number().optional(),
  disarmPhysical: z.number().optional(),
  melee: z.number().optional(),
  save: z.number().optional(),
  search: z.number().optional(),
  shoot: z.number().optional(),
  stealth: z.number().optional(),
  throw: z.number().optional(),
})

export const z_effect = z.object({
  effect: z_enumValueParser(EF),
  subType: z.string().optional(),
  radius: z.number().optional(),
  other: z.number().optional(),
})

export type zEffectJSON = z.input<typeof z_effect>
export type zEffectParams = z.output<typeof z_effect>

export function effectToJson(effect: zEffectParams): zEffectJSON {
  return {
    effect: enumValueToKey(effect.effect, EF),
    subType: effect.subType,
    radius: effect.radius,
    other: effect.other,
  }
}

export const z_expression = z.object({
  variable: z.string(),
  type: z_enumValueParser(EX), // TODO: Where does this come from? validate
  expression: z.string(), // basically a function of the previous two
})

export type zExpressionJSON = z.input<typeof z_expression>
export type zExpressionParams = z.output<typeof z_expression>

export function expressionToJson(expression?: zExpressionParams): zExpressionJSON | undefined {
  return expression == null ? undefined : {
    variable: expression.variable,
    type: enumValueToKey(expression.type, EX),
    expression: expression.expression,
  }
}
