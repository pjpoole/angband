import {
  asEnum,
  asTokens,
  ParserValues
} from '../../common/utilities/parsers'
import {
  CombatJSON,
  zEffectJSON,
} from '../../common/utilities/zod'
import { EF } from '../../common/spells/effects'

export function parseCombat(values: ParserValues): CombatJSON {
  const [toHit, toDamage, toAC] = asTokens(values, 3)
  return { toHit, toDamage, toAC }
}

// TODO: Modify me once we narrow the types of the other tokens
function effectsAreEqual(eff1: zEffectJSON, eff2: zEffectJSON): boolean {
  return (
    eff1.effect === eff2.effect
  )
}

export function parseEffect(values: ParserValues, current: zEffectJSON[] = []): zEffectJSON[] {
  const tokens = asTokens(values, 1, 4)
  // TODO: figure out types of other 3 tokens
  const newEffect = {
    effect: asEnum(tokens[0], EF)
  }

  if (current.length === 0) {
    current.push(newEffect)
  } else {
    const found = current.find(effect => effectsAreEqual(effect, newEffect))
    if (found == null) {
      current.push(newEffect)
    }
  }

  return current
}
