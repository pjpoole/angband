import {
  asFlags,
  asInteger,
  ParserValues,
} from '../../common/utilities/parsing/primitives'
import { maybeAsEnum } from '../../common/utilities/parsing/enums'

import { enumValueToKeyOrThrow } from '../../common/utilities/serializing/enum'

import { STAT } from '../../common/player/stats'
import { OBJ_MOD } from '../../common/objects/modifiers'
import {
  ELEM,
  isResistsElem,
  RESISTS_ELEM,
  toResistsValue,
} from '../../common/spells/elements'

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
