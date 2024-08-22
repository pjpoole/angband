import { maybeAsEnum } from './enums'
import { asFlags, asInteger, ParserValues } from './primitives'

import { OBJ_MOD } from '../../objects/modifiers'
import { STAT } from '../../player/stats'
import { isResistsElem } from '../../spells/elements'

import { ObjectModifierJson, ResistJson, StatJson, ValueJson } from '../values'

interface ValueData {
  stat: string
  value: number
}

function extractValueData(str: string): ValueData {
  const regex = /^(?<stat>[A-Z_]+)\[(?<val>[^\]]+)\]/
  const matchData = regex.exec(str)
  if (matchData == null || matchData.groups == null) throw new Error(
    'invalid value')

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
