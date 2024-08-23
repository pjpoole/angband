import { asTokens, ParserValues } from './primitives'
import { zCombatJSON } from '../zod/combat'

export function parseCombat(values: ParserValues): zCombatJSON {
  const [toHit, toDamage, toAC] = asTokens(values, 3)
  return { toHit, toDamage, toAC }
}
