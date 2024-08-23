import { zObjectCurseJson, zObjectCurseParams } from '../zod/curse'
import {
  zArmorJson,
  zArmorParams,
  zAttackJson,
  zAttackParams
} from '../zod/object'

export function armorToJson(armor: zArmorParams): zArmorJson {
  return {
    baseAC: armor.baseAC,
    plusToAC: armor.plusToAC.toString(),
  } as zArmorJson
}

export function attackToJson(attack: zAttackParams): zAttackJson {
  return {
    baseDamage: attack.baseDamage.toString(),
    plusToHit: attack.plusToHit.toString(),
    plusToDamage: attack.plusToDamage.toString(),
  } as zAttackJson
}

export function curseObjectToJson(curse: zObjectCurseParams): zObjectCurseJson {
  return {
    curse: curse.curse.name,
    power: curse.power,
  }
}
