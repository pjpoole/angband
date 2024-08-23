import { zObjectCurseJson, zObjectCurseParams } from '../zod/curse'
import {
  zArmorJson,
  zArmorParams,
  zAttackJson,
  zAttackParams,
  zItemJson,
  zItemParams
} from '../zod/object'
import { objectValueToKey } from '../object'
import { TV_NAMES } from '../../objects/tval'

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

export function itemToJson(item: zItemParams): zItemJson {
  return {
    tval: objectValueToKey(item.tval, TV_NAMES)!,
    sval: item.sval,
  }
}
