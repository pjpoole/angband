import { z } from 'zod'
import { NameRegistry } from '../core/Registry'
import { SerializableBase } from '../core/serializable'

import { enumValueToKey } from '../utilities/serializing/enum'
import { effectObjectsToJson } from '../utilities/serializing/effect'
import { spellLoreToJson } from '../utilities/serializing/lore'

import { z_enumValueParser } from '../utilities/zod/enums'
import { z_effectObject, zEffectObjectParams } from '../utilities/zod/effect'
import {
  z_spellLore,
  zSpellLoreParams
} from '../utilities/zod/lore'

import { MSG } from '../game/messages'

// mon-spell.h, mon_spell_type
export const RST = {
  NONE: 0x0000,
  BOLT: 0x0001,
  BALL: 0x0002, // balls and beams
  BREATH: 0x0004,
  DIRECT: 0x0008, // non-projectable attacks
  ANNOY: 0x0010, // irritant spells, usually non-fatal
  HASTE: 0x0020,
  HEAL: 0x0040,
  HEAL_OTHER: 0x0080,
  TACTIC: 0x0100, // get a better position
  ESCAPE: 0x0200,
  SUMMON: 0x0400,
  INNATE: 0x0800,
  ARCHERY: 0x1000
}

// list-mon-spells.h
// R[?] Spell Flag
export enum RSF {
  NONE,
  SHRIEK,
  WHIP,
  SPIT,
  SHOT,
  ARROW,
  BOLT,
  BR_ACID,
  BR_ELEC,
  BR_FIRE,
  BR_COLD,
  BR_POIS,
  BR_NETH,
  BR_LIGHT,
  BR_DARK,
  BR_SOUN,
  BR_CHAO,
  BR_DISE,
  BR_NEXU,
  BR_TIME,
  BR_INER,
  BR_GRAV,
  BR_SHAR,
  BR_PLAS,
  BR_WALL,
  BR_MANA,
  BOULDER,
  WEAVE,
  BA_ACID,
  BA_ELEC,
  BA_FIRE,
  BA_COLD,
  BA_POIS,
  BA_SHAR,
  BA_NETH,
  BA_WATE,
  BA_MANA,
  BA_HOLY,
  BA_DARK,
  BA_LIGHT,
  STORM,
  DRAIN_MANA,
  MIND_BLAST,
  BRAIN_SMASH,
  WOUND,
  BO_ACID,
  BO_ELEC,
  BO_FIRE,
  BO_COLD,
  BO_POIS,
  BO_NETH,
  BO_WATE,
  BO_MANA,
  BO_PLAS,
  BO_ICE,
  MISSILE,
  BE_ELEC,
  BE_NETH,
  SCARE,
  BLIND,
  CONF,
  SLOW,
  HOLD,
  HASTE,
  HEAL,
  HEAL_KIN,
  BLINK,
  TPORT,
  TELE_TO,
  TELE_SELF_TO,
  TELE_AWAY,
  TELE_LEVEL,
  DARKNESS,
  TRAPS,
  FORGET,
  SHAPECHANGE,
  S_KIN,
  S_HI_DEMON,
  S_MONSTER,
  S_MONSTERS,
  S_ANIMAL,
  S_SPIDER,
  S_HOUND,
  S_HYDRA,
  S_AINU,
  S_DEMON,
  S_UNDEAD,
  S_DRAGON,
  S_HI_UNDEAD,
  S_HI_DRAGON,
  S_WRAITH,
  S_UNIQUE
}

export const monsterSpells = {
  [RSF.NONE]: RST.NONE,
  [RSF.SHRIEK]: RST.ANNOY | RST.INNATE,
  [RSF.WHIP]: RST.BOLT | RST.INNATE,
  [RSF.SPIT]: RST.BOLT | RST.INNATE,
  [RSF.SHOT]: RST.BOLT | RST.INNATE | RST.ARCHERY,
  [RSF.ARROW]: RST.BOLT | RST.INNATE | RST.ARCHERY,
  [RSF.BOLT]: RST.BOLT | RST.INNATE | RST.ARCHERY,
  [RSF.BR_ACID]: RST.BREATH | RST.INNATE,
  [RSF.BR_ELEC]: RST.BREATH | RST.INNATE,
  [RSF.BR_FIRE]: RST.BREATH | RST.INNATE,
  [RSF.BR_COLD]: RST.BREATH | RST.INNATE,
  [RSF.BR_POIS]: RST.BREATH | RST.INNATE,
  [RSF.BR_NETH]: RST.BREATH | RST.INNATE,
  [RSF.BR_LIGHT]: RST.BREATH | RST.INNATE,
  [RSF.BR_DARK]: RST.BREATH | RST.INNATE,
  [RSF.BR_SOUN]: RST.BREATH | RST.INNATE,
  [RSF.BR_CHAO]: RST.BREATH | RST.INNATE,
  [RSF.BR_DISE]: RST.BREATH | RST.INNATE,
  [RSF.BR_NEXU]: RST.BREATH | RST.INNATE,
  [RSF.BR_TIME]: RST.BREATH | RST.INNATE,
  [RSF.BR_INER]: RST.BREATH | RST.INNATE,
  [RSF.BR_GRAV]: RST.BREATH | RST.INNATE,
  [RSF.BR_SHAR]: RST.BREATH | RST.INNATE,
  [RSF.BR_PLAS]: RST.BREATH | RST.INNATE,
  [RSF.BR_WALL]: RST.BREATH | RST.INNATE,
  [RSF.BR_MANA]: RST.BREATH | RST.INNATE,
  [RSF.BOULDER]: RST.BOLT | RST.INNATE,
  [RSF.WEAVE]: RST.ANNOY | RST.INNATE,
  [RSF.BA_ACID]: RST.BALL,
  [RSF.BA_ELEC]: RST.BALL,
  [RSF.BA_FIRE]: RST.BALL,
  [RSF.BA_COLD]: RST.BALL,
  [RSF.BA_POIS]: RST.BALL,
  [RSF.BA_SHAR]: RST.BALL,
  [RSF.BA_NETH]: RST.BALL,
  [RSF.BA_WATE]: RST.BALL,
  [RSF.BA_MANA]: RST.BALL,
  [RSF.BA_HOLY]: RST.BALL,
  [RSF.BA_DARK]: RST.BALL,
  [RSF.BA_LIGHT]: RST.BALL,
  [RSF.STORM]: RST.BALL,
  [RSF.DRAIN_MANA]: RST.ANNOY,
  [RSF.MIND_BLAST]: RST.DIRECT | RST.ANNOY,
  [RSF.BRAIN_SMASH]: RST.DIRECT | RST.ANNOY,
  [RSF.WOUND]: RST.DIRECT,
  [RSF.BO_ACID]: RST.BOLT,
  [RSF.BO_ELEC]: RST.BOLT,
  [RSF.BO_FIRE]: RST.BOLT,
  [RSF.BO_COLD]: RST.BOLT,
  [RSF.BO_POIS]: RST.BOLT,
  [RSF.BO_NETH]: RST.BOLT,
  [RSF.BO_WATE]: RST.BOLT,
  [RSF.BO_MANA]: RST.BOLT,
  [RSF.BO_PLAS]: RST.BOLT,
  [RSF.BO_ICE]: RST.BOLT,
  [RSF.MISSILE]: RST.BOLT,
  [RSF.BE_ELEC]: RST.BALL,
  [RSF.BE_NETH]: RST.BALL,
  [RSF.SCARE]: RST.ANNOY,
  [RSF.BLIND]: RST.ANNOY,
  [RSF.CONF]: RST.ANNOY,
  [RSF.SLOW]: RST.ANNOY | RST.HASTE,
  [RSF.HOLD]: RST.ANNOY | RST.HASTE,
  [RSF.HASTE]: RST.HASTE,
  [RSF.HEAL]: RST.HEAL,
  [RSF.HEAL_KIN]: RST.HEAL_OTHER,
  [RSF.BLINK]: RST.TACTIC | RST.ESCAPE,
  [RSF.TPORT]: RST.ESCAPE,
  [RSF.TELE_TO]: RST.ANNOY,
  [RSF.TELE_SELF_TO]: RST.ANNOY,
  [RSF.TELE_AWAY]: RST.ESCAPE,
  [RSF.TELE_LEVEL]: RST.ESCAPE,
  [RSF.DARKNESS]: RST.ANNOY,
  [RSF.TRAPS]: RST.ANNOY,
  [RSF.FORGET]: RST.ANNOY,
  [RSF.SHAPECHANGE]: RST.TACTIC,
  [RSF.S_KIN]: RST.SUMMON,
  [RSF.S_HI_DEMON]: RST.SUMMON,
  [RSF.S_MONSTER]: RST.SUMMON,
  [RSF.S_MONSTERS]: RST.SUMMON,
  [RSF.S_ANIMAL]: RST.SUMMON,
  [RSF.S_SPIDER]: RST.SUMMON,
  [RSF.S_HOUND]: RST.SUMMON,
  [RSF.S_HYDRA]: RST.SUMMON,
  [RSF.S_AINU]: RST.SUMMON,
  [RSF.S_DEMON]: RST.SUMMON,
  [RSF.S_UNDEAD]: RST.SUMMON,
  [RSF.S_DRAGON]: RST.SUMMON,
  [RSF.S_HI_UNDEAD]: RST.SUMMON,
  [RSF.S_HI_DRAGON]: RST.SUMMON,
  [RSF.S_WRAITH]: RST.SUMMON,
  [RSF.S_UNIQUE]: RST.SUMMON,
}

export const MonsterSpellSchema = z.object({
  name: z.string(),
  messageType: z_enumValueParser(MSG).optional(),
  hit: z.number().min(0).max(100),
  effects: z.array(z_effectObject),
  lore: z.array(z_spellLore),
}).refine(
  (obj) => {
    let previous: number | undefined = undefined
    for (const lore of obj.lore) {
      if (previous == null) {
        previous = lore.powerCutoff || Number.MIN_VALUE
      } else {
        if (lore.powerCutoff == null) return false
        if (previous > lore.powerCutoff) return false
        previous = lore.powerCutoff
      }
    }

    return true
  },
  { message: 'misconfigured power cutoffs in lore' }
)

export type MonsterSpellJSON = z.input<typeof MonsterSpellSchema>
export type MonsterSpellParams = z.output<typeof MonsterSpellSchema>

export class MonsterSpell extends SerializableBase {
  static readonly schema = MonsterSpellSchema

  readonly name: string
  readonly messageType?: MSG
  readonly hit: number
  readonly effects: zEffectObjectParams[]
  readonly lore: zSpellLoreParams[]

  constructor(params: MonsterSpellParams) {
    super(params)

    this.name = params.name
    this.messageType = params.messageType
    this.hit = params.hit
    this.effects = params.effects
    this.lore = params.lore
  }

  register() {
    MonsterSpellRegistry.add(this.name, this)
  }

  toJSON(): MonsterSpellJSON {
    return {
      name: this.name,
      messageType: enumValueToKey(this.messageType, MSG),
      hit: this.hit,
      effects: effectObjectsToJson(this.effects),
      lore: this.lore.map(spellLoreToJson),
    }
  }
}

export const MonsterSpellRegistry = new NameRegistry(MonsterSpell)
