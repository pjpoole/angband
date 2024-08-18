// list-elements.h
import { enumToKeyArray, EnumValueOnly } from '../utilities/enum'

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

export type ELEM_VALUES = EnumValueOnly<ELEM>
export const ELEM_KEYS = enumToKeyArray(ELEM)
