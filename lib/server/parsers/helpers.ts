import {
  asEnum,
  asTokens,
  ParserValues,
} from '../../common/utilities/parsers'
import {
  CombatJSON,
  zEffectJSON,
  zExpressionJSON,
} from '../../common/utilities/zod'
import { EF } from '../../common/spells/effects'
import { EX } from '../../common/spells/expressions'

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

export function parseEffects(values: ParserValues, current: zEffectJSON[] = []): zEffectJSON[] {
  const newEffect = parseEffect(values)

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

export function parseEffect(values: ParserValues): zEffectJSON {
  const tokens = asTokens(values, 1, 4)
  // TODO: figure out types of other 3 tokens
  return {
    effect: asEnum(tokens[0], EF)
  }
}

export function parseExpression(values: ParserValues): zExpressionJSON {
  const [variable, type, expression] = asTokens(values, 3)
  return { variable, type: asEnum(type, EX), expression }
}
