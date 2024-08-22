import { z } from 'zod'
import { z_enumValueParser } from './enums'

import { EF } from '../../spells/effects'

export const z_effect = z.object({
  effect: z_enumValueParser(EF),
  subType: z.string().optional(),
  radius: z.number().optional(),
  other: z.number().optional(),
})

export type zEffectJSON = z.input<typeof z_effect>
export type zEffectParams = z.output<typeof z_effect>
