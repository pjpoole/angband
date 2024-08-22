import { zEffectJSON, zEffectParams } from '../zod/effect'
import { enumValueToKey } from '../enum'
import { EF } from '../../spells/effects'

export function effectToJson(effect: zEffectParams): zEffectJSON {
  return {
    effect: enumValueToKey(effect.effect, EF),
    subType: effect.subType,
    radius: effect.radius,
    other: effect.other,
  }
}
