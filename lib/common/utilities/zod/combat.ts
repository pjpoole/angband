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

export type CombatJSON = z.input<typeof z_combat>
export type CombatParams = z.output<typeof z_combat>
export type CombatMinJSON = z.input<typeof z_combatMin>
export type CombatMinParams = z.output<typeof z_combatMin>
