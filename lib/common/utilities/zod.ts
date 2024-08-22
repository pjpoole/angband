import { z } from 'zod'
import { enumValueToKey } from './enum'
import { EX } from '../spells/expressions'
import { EF } from '../spells/effects'
import { z_enumValueParser } from './zod/enums'

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
