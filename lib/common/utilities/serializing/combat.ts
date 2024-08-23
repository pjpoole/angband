import {
  CombatJSON,
  CombatMinJSON,
  CombatMinParams,
  CombatParams
} from '../zod/combat'

export function combatToJson(combat: CombatParams): CombatJSON {
  return {
    toHit: combat.toHit.toString(),
    toDamage: combat.toDamage.toString(),
    toAC: combat.toAC.toString(),
  }
}

export function combatMinToJson(combat: CombatMinParams): CombatMinJSON {
  return {
    toHit: combat.toHit?.toString(),
    toDamage: combat.toDamage?.toString(),
    toAC: combat.toAC?.toString(),
  }
}
