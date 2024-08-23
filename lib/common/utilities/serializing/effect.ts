import {
  zEffectJSON,
  zEffectObjectJSON,
  zEffectObjectParams,
  zEffectParams
} from '../zod/effect'
import { enumValueToKey } from './enum'
import { expressionToJson } from './expression'
import { ifExists } from './helpers'

import { EF } from '../../spells/effects'

export function effectObjectsToJson(objs: zEffectObjectParams[]): zEffectObjectJSON[] {
  return objs.map(effectObjectToJson)
}

export function effectObjectToJson(obj: zEffectObjectParams): zEffectObjectJSON {
  return {
    effect: effectToJson(obj.effect),
    x: obj.x,
    y: obj.y,
    dice: obj.dice?.toString(),
    expression: ifExists(obj.expression, expressionToJson),
  }
}

export function effectToJson(effect: zEffectParams): zEffectJSON {
  return {
    effect: enumValueToKey(effect.effect, EF),
    subType: effect.subType,
    radius: effect.radius,
    other: effect.other,
  }
}
