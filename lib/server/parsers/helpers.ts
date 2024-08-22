import {
  asFlags,
  asInteger,
  asTokens,
  ParserValues,
} from '../../common/utilities/parsing/primitives'
import { asEnum, maybeAsEnum } from '../../common/utilities/parsing/enums'
import { isValidSubtype } from '../../common/utilities/parseGameObjects'
import {
  zEffectJSON,
  zExpressionJSON,
} from '../../common/utilities/zod'
import { CombatJSON } from '../../common/utilities/zod/combat'

import { enumValueToKeyOrThrow } from '../../common/utilities/enum'

import { STAT } from '../../common/player/stats'
import { EF, EffectJSON } from '../../common/spells/effects'
import { EX } from '../../common/spells/expressions'
import { OBJ_MOD } from '../../common/objects/modifiers'
import {
  ELEM,
  isResistsElem,
  RESISTS_ELEM,
  toResistsValue,
} from '../../common/spells/elements'

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

export interface StatJson {
  stat: keyof typeof STAT
  value: number
}

export interface ObjectModifierJson {
  stat: keyof typeof OBJ_MOD
  value: number
}

export interface ResistJson {
  stat: RESISTS_ELEM
  value: number
}

export interface StatParams {
  type: 'stat'
  stat: STAT
  value: number
}

export interface ObjectModifierParams {
  type: 'object'
  stat: OBJ_MOD
  value: number
}

export interface ResistParams {
  type: 'resist'
  stat: ELEM
  value: number
}

interface ValueData {
  stat: string
  value: number
}

export type ValueJson = StatJson | ObjectModifierJson | ResistJson
export type ValueParams = StatParams | ObjectModifierParams | ResistParams

function extractValueData(str: string): ValueData {
  const regex = /^(?<stat>[A-Z_]+)\[(?<val>[^\]]+)\]/
  const matchData = regex.exec(str)
  if (matchData == null || matchData.groups == null) throw new Error('invalid value')

  const { stat, val } = matchData.groups

  return { stat, value: asInteger(val) }
}

export function valueStringsToJson(values: ParserValues): ValueJson[] {
  return asFlags(values).map(valueStringToJson)
}

function valueStringToJson(str: string): ValueJson {
  const { stat, value } = extractValueData(str)
  const maybeStat = maybeAsEnum(stat, STAT)

  if (maybeStat) {
    return {
      stat: maybeStat,
      value,
    } as StatJson
  }

  const maybeObject = maybeAsEnum(stat, OBJ_MOD)

  if (maybeObject) {
    return {
      stat: maybeObject,
      value,
    } as ObjectModifierJson
  }

  if (isResistsElem(stat)) {
    return {
      stat: stat,
      value,
    } as ResistJson
  }

  throw new Error('invalid value type')
}

export function valuesToParams(values: ValueJson[]): ValueParams[] {
  return values.map(value => valueToParams(value))
}

export function valueToParams(json: ValueJson): ValueParams {
  const { stat, value } = json

  const maybeStat = maybeAsEnum(stat, STAT)

  if (maybeStat) {
    return {
      type: 'stat',
      stat: STAT[maybeStat],
      value,
    } as StatParams
  }

  const maybeObject = maybeAsEnum(stat, OBJ_MOD)

  if (maybeObject) {
    return {
      type: 'object',
      stat: OBJ_MOD[maybeObject],
      value,
    } as ObjectModifierParams
  }

  try {
    return {
      type: 'resist',
      stat: toResistsValue(stat as RESISTS_ELEM),
      value,
    } as ResistParams
  } catch (e) {
    throw new Error('invalid value type')
  }
}

export function valueParamsToJson(valueParams?: ValueParams[]): ValueJson[] | undefined {
  return valueParams == null ? undefined : valueParams.map(valueParamToJson)
}

function valueParamToJson(valueParam: ValueParams): ValueJson {
  const { type, stat, value } = valueParam
  switch (type) {
    case 'stat': return { stat: enumValueToKeyOrThrow(stat, STAT), value }
    case 'object': return { stat: enumValueToKeyOrThrow(stat, OBJ_MOD), value}
    case 'resist':
      return {
        stat: `RES_${enumValueToKeyOrThrow(stat, ELEM)}` as RESISTS_ELEM,
        value
      }
    default: throw new Error('invalid value params')
  }
}
