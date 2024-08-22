import { maybeAsEnum } from './parsing/enums'
import { ShapeRegistry, SummonRegistry } from '../game/registries'

import { STAT } from '../player/stats'
import { EF } from '../spells/effects'
import { MON_TMD, TMD } from '../spells/effectsTimed'
import { ELEM } from '../spells/elements'
import { ENCH } from '../spells/enchantments'
import { NOURISH } from '../spells/nourish'
import { PROJ } from '../spells/projections'
import { GLYPH } from '../world/trap'

/*
 * A couple different paths:
 * - file string to serializable (i.e. json) -- needs to maintain strings
 *   therefore, just validate entries
 * - serializable to objects: we're encapsulated, so we hand effects around as
 *   opaque boxes and trust lookup functions. Make sure the same code is reused
 *   as much as possible.
 */
export function isValidSubtype(effect: EF, token: string): boolean {
  return getEffectSubtype(effect, token) !== null
}

export function getEffectSubtype(effect: EF, token: string):
  | keyof typeof PROJ
  | keyof typeof ELEM
  | keyof typeof TMD
  | keyof typeof NOURISH
  | keyof typeof MON_TMD
  | number // summon id, or shape id
  | keyof typeof STAT
  | keyof typeof ENCH
  | keyof typeof GLYPH
  | null {
  switch (effect) {
    case EF.ALTER:
    case EF.ARC:
    case EF.BALL:
    case EF.BEAM:
    case EF.BOLT:
    case EF.BOLT_AWARE:
    case EF.BOLT_OR_BEAM:
    case EF.BOLT_STATUS:
    case EF.BOLT_STATUS_DAM:
    case EF.BREATH:
    case EF.DESTRUCTION:
    case EF.LASH:
    case EF.LINE:
    case EF.MELEE_BLOWS:
    case EF.PROJECT_LOS:
    case EF.PROJECT_LOS_AWARE:
    case EF.SHORT_BEAM:
    case EF.SPHERE:
    case EF.SPOT:
    case EF.STAR:
    case EF.STAR_BALL:
    case EF.STRIKE:
    case EF.SWARM:
    case EF.TOUCH:
    case EF.TOUCH_AWARE:
      return getProjectionOrElement(token)

    case EF.CURE:
    case EF.TIMED_SET:
    case EF.TIMED_INC:
    case EF.TIMED_INC_NO_RES:
    case EF.TIMED_DEC:
      return getTimedSubEffect(token)

    case EF.NOURISH:
      return getNourishSubEffect(token)

    case EF.MON_TIMED_INC:
      return getMonsterTimedSubEffect(token)

    case EF.SUMMON:
      return getMonsterSummon(token)

    case EF.DRAIN_STAT:
    case EF.GAIN_STAT:
    case EF.LOSE_RANDOM_STAT:
    case EF.RESTORE_STAT:
      return getStat(token)

    case EF.ENCHANT:
      return getEnchantment(token)

    case EF.SHAPECHANGE:
      return getShape(token)

    case EF.EARTHQUAKE:
      return getEarthQuake(token)

    case EF.GLYPH:
      return getGlyph(token)

    case EF.TELEPORT:
      return getTeleport(token)

    case EF.TELEPORT_TO:
      return getTeleportTo(token)

    default:
      return getDefault(token)
  }
}

function getProjectionOrElement(token: string): keyof typeof PROJ | keyof typeof ELEM | null {
  return maybeAsEnum(token, PROJ) ?? maybeAsEnum(token, ELEM) ?? null
}

function getTimedSubEffect(token: string): keyof typeof TMD | null {
  return maybeAsEnum(token, TMD) ?? null
}

function getMonsterTimedSubEffect(token: string): keyof typeof MON_TMD | null {
  return maybeAsEnum(token, MON_TMD) ?? null
}

function getNourishSubEffect(token: string): keyof typeof NOURISH | null {
  return maybeAsEnum(token, NOURISH) ?? null
}

function getMonsterSummon(token: string): number | null {
  return SummonRegistry.get(token)?.id ?? null
}

function getStat(token: string): keyof typeof STAT | null {
  return maybeAsEnum(token, STAT) ?? null
}

function getEnchantment(token: string): keyof typeof ENCH | null {
  return maybeAsEnum(token, ENCH) ?? null
}

function getShape(token: string): number | null {
  return ShapeRegistry.get(token)?.id ?? null
}

function getEarthQuake(token: string): number | null {
  if (token === 'TARGETED') return 1
  if (token === 'NONE') return 0
  return null
}

function getGlyph(token: string): keyof typeof GLYPH | null {
  return maybeAsEnum(token, GLYPH) ?? null
}

function getTeleport(token: string): number | null {
  return token === 'AWAY' ? 1 : null
}

function getTeleportTo(token: string): number | null {
  return token === 'SELF' ? 1 : null
}

function getDefault(token: string): number | null {
  return token === 'NONE' ? 1 : null
}
