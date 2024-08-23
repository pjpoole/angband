import {
  zBlowLoreJSON,
  zBlowLoreParams,
  zSpellLoreJSON,
  zSpellLoreParams
} from '../zod/lore'
import { colorCodeToString } from '../colors'
import { ifExists } from './helpers'

export function blowLoreToJson(lore: zBlowLoreParams): zBlowLoreJSON {
  return {
    lore: lore.lore,
    colorBase: colorCodeToString(lore.colorBase),
    colorResist: ifExists(lore.colorResist, colorCodeToString),
    colorImmune: ifExists(lore.colorImmune, colorCodeToString),
  }
}

export function spellLoreToJson(lore: zSpellLoreParams): zSpellLoreJSON {
  return {
    powerCutoff: lore.powerCutoff,
    lore: lore.lore,
    colorBase: colorCodeToString(lore.colorBase),
    colorResist: ifExists(lore.colorResist, colorCodeToString),
    colorImmune: ifExists(lore.colorImmune, colorCodeToString),
    messageSave: lore.messageSave,
    messageVisible: lore.messageVisible,
    messageInvisible: lore.messageInvisible,
    messageMiss: lore.messageMiss,
  }
}
