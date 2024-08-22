import { z } from 'zod'

import { maybeAsEnum } from '../parsing/enums'

import { OBJ_MOD } from '../../objects/modifiers'
import { STAT } from '../../player/stats'
import { RESISTS_ELEM, toResistsValue } from '../../spells/elements'

import {
  ObjectModifierParams,
  ResistParams,
  StatParams,
  ValueJson,
  ValueParams
} from '../values'

export const z_value = z.object({
  stat: z.string(),
  value: z.number(),
}).transform((val, ctx) => {
  try {
    return valueToParams(val as ValueJson)
  } catch (e) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'invalid value'
    })
    return z.NEVER
  }
})

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
