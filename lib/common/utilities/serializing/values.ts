import { enumValueToKeyOrThrow } from './enum'
import { ValueJson, ValueParams } from '../values'

import { OBJ_MOD } from '../../objects/modifiers'
import { STAT } from '../../player/stats'
import { ELEM, RESISTS_ELEM } from '../../spells/elements'

export function valueParamsToJson(valueParams: ValueParams[]): ValueJson[] {
  return valueParams.map(valueParamToJson)
}

function valueParamToJson(valueParam: ValueParams): ValueJson {
  const { type, stat, value } = valueParam
  switch (type) {
    case 'stat':
      return { stat: enumValueToKeyOrThrow(stat, STAT), value }
    case 'object':
      return { stat: enumValueToKeyOrThrow(stat, OBJ_MOD), value }
    case 'resist':
      return {
        stat: `RES_${enumValueToKeyOrThrow(stat, ELEM)}` as RESISTS_ELEM,
        value
      }
    default:
      throw new Error('invalid value params')
  }
}
