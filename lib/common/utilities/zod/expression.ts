import { z } from 'zod'
import { z_enumValueParser } from './enums'
import { EX } from '../../spells/expressions'

export const z_expression = z.object({
  variable: z.string(),
  type: z_enumValueParser(EX), // TODO: Where does this come from? validate
  expression: z.string(), // basically a function of the previous two
})

export type zExpressionJSON = z.input<typeof z_expression>
export type zExpressionParams = z.output<typeof z_expression>
