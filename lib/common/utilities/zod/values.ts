import { z } from 'zod'
import { z_diceExpression } from './dice'

import { maybeAsEnum } from '../parsing/enums'

import { OBJ_MOD } from '../../objects/modifiers'
import { STAT } from '../../player/stats'
import { RESISTS_ELEM, toResistsValue } from '../../spells/elements'

import {
  ObjectModifierParams,
  ResistParams,
  StatParams,
  ValueParams
} from '../values'
import { Dice } from '../dice'

interface IntermediateValue {
  stat: string,
  value: Dice,
}

export const z_value = z.object({
  stat: z.string(),
  value: z_diceExpression,
}).transform((val, ctx) => {
  try {
    return valueToParams(val)
  } catch (e) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'invalid value'
    })
    return z.NEVER
  }
})

function valuesToParams(values: IntermediateValue[]): ValueParams[] {
  return values.map(value => valueToParams(value))
}

function valueToParams(json: IntermediateValue): ValueParams {
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
