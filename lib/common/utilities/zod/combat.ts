import { z } from 'zod'
import { z_diceExpression } from './dice'

export const z_combat = z.object({
  toHit: z_diceExpression,
  toDamage: z_diceExpression,
  toAC: z_diceExpression,
})

export type CombatJSON = z.input<typeof z_combat>
export type CombatParams = z.output<typeof z_combat>
