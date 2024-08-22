import { CombatJSON, CombatParams } from '../zod/combat'

export function combatToJson(combat?: CombatParams): CombatJSON | undefined {
  return combat == null ? undefined : {
    toHit: combat.toHit.toString(),
    toDamage: combat.toDamage.toString(),
    toAC: combat.toAC.toString(),
  }
}
