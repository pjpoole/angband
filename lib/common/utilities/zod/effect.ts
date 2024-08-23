import { z } from 'zod'
import { z_diceExpression } from './dice'
import { z_enumValueParser } from './enums'
import { z_expression } from './expression'

import { EF } from '../../spells/effects'

export const z_effect = z.object({
  effect: z_enumValueParser(EF),
  subType: z.string().optional(),
  radius: z.number().optional(),
  other: z.number().optional(),
})

export const z_effectObject = z.object({
  effect: z_effect,
  x: z.number().optional(),
  y: z.number().optional(),
  dice: z_diceExpression.optional(),
  expression: z_expression.optional(),
})

export type zEffectJSON = z.input<typeof z_effect>
export type zEffectParams = z.output<typeof z_effect>
export type zEffectObjectJSON = z.input<typeof z_effectObject>
export type zEffectObjectParams = z.output<typeof z_effectObject>
