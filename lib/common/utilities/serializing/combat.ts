import {
  zCombatJSON,
  zCombatMinJSON,
  zCombatMinParams,
  zCombatParams
} from '../zod/combat'

export function combatToJson(combat: zCombatParams): zCombatJSON {
  return {
    toHit: combat.toHit.toString(),
    toDamage: combat.toDamage.toString(),
    toAC: combat.toAC.toString(),
  }
}

export function combatMinToJson(combat: zCombatMinParams): zCombatMinJSON {
  return {
    toHit: combat.toHit?.toString(),
    toDamage: combat.toDamage?.toString(),
    toAC: combat.toAC?.toString(),
  }
}
