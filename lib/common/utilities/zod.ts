import { z } from 'zod'
import { enumValueToKey } from './enum'
import { EX } from '../spells/expressions'
import { z_enumValueParser } from './zod/enums'

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
