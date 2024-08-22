import { asTokens, ParserValues } from './primitives'
import { CombatJSON } from '../zod/combat'

export function parseCombat(values: ParserValues): CombatJSON {
  const [toHit, toDamage, toAC] = asTokens(values, 3)
  return { toHit, toDamage, toAC }
}
