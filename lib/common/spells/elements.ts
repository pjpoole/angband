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
export type RESISTS_ELEM = `RES_${keyof typeof ELEM}`

export function isHatesElem(str: string): str is HATES_ELEM {
  const [prefix, suffix] = getPrefixAndSuffix(str)
  return prefix === 'HATES_' && ELEM[suffix as unknown as keyof typeof ELEM] != null
}

export function isIgnoreElem(str: string): str is IGNORE_ELEM {
  const [prefix, suffix] = getPrefixAndSuffix(str)
  return prefix === 'IGNORE_' && ELEM[suffix as unknown as keyof typeof ELEM] != null
}

export function isResistsElem(str: string): str is RESISTS_ELEM {
  const [prefix, suffix] = getPrefixAndSuffix(str)
  return prefix === 'RES_' && ELEM[suffix as unknown as keyof typeof ELEM] != null
}

export function toResistsValue(str: RESISTS_ELEM): ELEM {
  const [prefix, suffix] = getPrefixAndSuffix(str)
  const element = ELEM[suffix as unknown as keyof typeof ELEM]
  if (prefix !== 'RES_' || element == null) throw new Error('invalid resist')
  return element
}
