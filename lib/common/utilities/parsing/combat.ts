import { asTokens, ParserValues } from './primitives'
import { zCombatJSON, zCombatMinJSON } from '../zod/combat'

export function parseCombat(values: ParserValues): zCombatJSON {
  const [toHit, toDamage, toAC] = asTokens(values, 3)
  return { toHit, toDamage, toAC }
}

export function parseCombatMin(values: ParserValues): zCombatMinJSON {
  const [toHit, toDamage, toAC] = asTokens(values, 3)
    .map(el => el === '255' ? undefined : el)
  return { toHit, toDamage, toAC }
}
