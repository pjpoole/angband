import { enumToKeyArray, EnumValueOnly } from '../utilities/enum'
import { getPrefixAndSuffix } from '../utilities/string'

// list-elements.h
// Elements
export enum ELEM {
  ACID,
  ELEC,
  FIRE,
  COLD,
  POIS,
  LIGHT,
  DARK,
  SOUND,
  SHARD,
  NEXUS,
  NETHER,
  CHAOS,
  DISEN,
  WATER,
  ICE,
  GRAVITY,
  INERTIA,
  FORCE,
  TIME,
  PLASMA,
  METEOR,
  MISSILE,
  MANA,
  HOLY_ORB,
  ARROW,
}

export type HATES_ELEM = `HATES_${keyof typeof ELEM}`
export type IGNORE_ELEM = `IGNORE_${keyof typeof ELEM}`

export function isHatesElem(str: string): str is HATES_ELEM {
  const [prefix, suffix] = getPrefixAndSuffix(str)
  return prefix === 'HATES_' && ELEM[suffix as unknown as ELEM] != null
}

export function isIgnoreElem(str: string): str is IGNORE_ELEM {
  const [prefix, suffix] = getPrefixAndSuffix(str)
  return prefix === 'IGNORE_' && ELEM[suffix as unknown as ELEM] != null
}

export type ELEM_VALUES = EnumValueOnly<ELEM>
export const ELEM_KEYS = enumToKeyArray(ELEM)
