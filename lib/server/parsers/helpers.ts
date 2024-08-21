import {
  asEnum,
  asInteger,
  asTokens,
  ParserValues,
} from '../../common/utilities/parsers'
import {
  isValidSubtype
} from '../../common/utilities/parseGameObjects'
import {
  CombatJSON,
  zEffectJSON,
  zExpressionJSON,
} from '../../common/utilities/zod'

import { EF, EffectJSON } from '../../common/spells/effects'
import { EX } from '../../common/spells/expressions'

export function parseCombat(values: ParserValues): CombatJSON {
  const [toHit, toDamage, toAC] = asTokens(values, 3)
  return { toHit, toDamage, toAC }
}

function effectsAreEqual(eff1: zEffectJSON, eff2: zEffectJSON): boolean {
  return (
    eff1.effect === eff2.effect &&   // EF
    eff1.subType === eff2.subType && // string | undefined
    eff1.radius === eff2.radius &&   // number | undefined
    eff1.other === eff2.other        // number | undefined
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
  const [rawEffect, rawSubType, rawRadius, rawOther] = values.split(':')

  if (rawEffect == null) throw new Error('empty effect string')
  const effect = asEnum(rawEffect, EF)

  const result: EffectJSON = { effect }

  if (rawSubType != null) {
    const effectValue: EF = EF[effect]

    if (!isValidSubtype(effectValue, rawSubType)) {
      throw new Error('invalid subtype data')
    }

    result.subType = rawSubType // unbranded, because the type is just nonsense
  }

  if (rawRadius != null) result.radius = asInteger(rawRadius)
  if (rawOther != null) result.other = asInteger(rawOther)

  return result
}

export function parseExpression(values: ParserValues): zExpressionJSON {
  const [variable, type, expression] = asTokens(values, 3)
  return { variable, type: asEnum(type, EX), expression }
}
