import { z } from 'zod'
import { z_diceExpression } from './dice'

export const z_combat = z.object({
  toHit: z_diceExpression,
  toDamage: z_diceExpression,
  toAC: z_diceExpression,
})

// min-combat from ego item permits "no lower bound" as a value; we represent it
// here as "missing"
export const z_combatMin = z_combat.partial()

export type zCombatJSON = z.input<typeof z_combat>
export type zCombatParams = z.output<typeof z_combat>
export type zCombatMinJSON = z.input<typeof z_combatMin>
export type zCombatMinParams = z.output<typeof z_combatMin>
