import { z } from 'zod'
import { NameRegistry } from '../core/Registry'
import { SerializableBase } from '../core/serializable'
import {
  enumValueSetToArray,
  enumValueToKey
} from '../utilities/serializing/enum'
import { itemToJson } from '../utilities/serializing/object'

import { z_blow } from '../utilities/zod/blow'
import { z_color } from '../utilities/zod/color'
import { z_diceExpression } from '../utilities/zod/dice'
import { z_enumValueParser } from '../utilities/zod/enums'
import { z_monsterBase } from '../utilities/zod/monsterBase'
import { z_item, zItemParams } from '../utilities/zod/object'

import { C, colorCodeToString } from '../utilities/colors'
import { setDifference, setUnion } from '../utilities/set'

import { BLOW_EF } from './blows'
import { RF } from './flags'
import { MonsterBase } from './monsterBase'
import { RSF } from './spells'

const spellObject = z.object({
  spell: z_enumValueParser(RSF),
  messageVisible: z.string().optional(),
  messageInvisible: z.string().optional(),
  messageMiss: z.string().optional(),
})

const blowObject = z.object({
  blow: z_blow,
  effect: z_enumValueParser(BLOW_EF).optional(),
  damage: z_diceExpression.optional(),
})

const dropBaseBase = z.object({
  tval: z.string(), // TODO: validate
  chance: z.number(),
  min: z.number(),
  max: z.number(),
})

const dropObjectBase = dropBaseBase.merge(z.object({
  sval: z.string(), // TODO: validate
}))

const dropBase = dropBaseBase.refine(
  (drop) => drop.min <= drop.max,
  { message: 'improper values for drop min/max'}
)

const dropObject = dropObjectBase.refine(
  (drop) => drop.min <= drop.max,
  { message: 'improper values for drop min/max'}
)

const friendRoles = ['servant', 'bodyguard'] as const
const friend = z.object({
  chance: z.number(),
  count: z_diceExpression,
  type: z.string(), // TODO: self-validate; introspects monster data. Also
                    //       note that 'same' is valid value and refers to this
  role: z.enum(friendRoles).optional(),
})

export const MonsterSchema = z.object({
  name: z.string(),
  plural: z.string().optional(),
  base: z_monsterBase,
  glyph: z.string().length(1).optional(),
  color: z_color,
  colorCycle: z.object({
    type: z.string(),
    subtype: z.string(),
  }).optional(),
  speed: z.number().optional(),
  averageHp: z.number().optional(),
  light: z.number().optional(),
  hearing: z.number().optional(),
  smell: z.number().optional(),
  armorClass: z.number().optional(),
  sleepiness: z.number().min(0).max(255).optional(),
  depth: z.number().optional(),
  rarity: z.number().optional(),
  experience: z.number().optional(),
  blows: z.array(blowObject).max(9).optional(),
  flags: z.array(z_enumValueParser(RF)).optional(),
  flagsOff: z.array(z_enumValueParser(RF)).optional(),
  innateFrequency: z.number().optional(),
  spellFrequency: z.number().optional(),
  spellPower: z.number().optional(),
  spells: z.array(spellObject).optional(),
  description: z.string().optional(),
  drop: z.array(dropObject).optional(),
  dropBase: z.array(dropBase).optional(),
  mimic: z.array(z_item).optional(),
  friends: z.array(friend).optional(),
  friendsBase: z.array(friend).optional(),
  shapes: z.array(z.string()).optional(), // TODO: validate Monster
})

export type MonsterJSON = z.input<typeof MonsterSchema>
export type MonsterParams = z.output<typeof MonsterSchema>

type MonsterBlowJSON = z.input<typeof blowObject>
type MonsterBlowParams = z.output<typeof blowObject>
type MonsterSpellJSON = z.input<typeof spellObject>
type MonsterSpellParams = z.output<typeof spellObject>
type MonsterDropParams = z.output<typeof dropObject>
type MonsterDropBaseParams = z.output<typeof dropBase>
type MonsterFriendJSON = z.input<typeof friend>
type MonsterFriendParams = z.output<typeof friend>

function friendToJson(friend: MonsterFriendParams): MonsterFriendJSON {
  return {
    type: friend.type,
    chance: friend.chance,
    count: friend.count.toString(),
    role: friend.role,
  }
}

function blowToJson(blow: MonsterBlowParams): MonsterBlowJSON {
  return {
    blow: blow.blow.name,
    effect: enumValueToKey(blow.effect, BLOW_EF),
    damage: blow.damage?.toString(),
  }
}

function spellToJson(spell: MonsterSpellParams): MonsterSpellJSON {
  return {
    spell: enumValueToKey(spell.spell, RSF),
    messageVisible: spell.messageVisible,
    messageInvisible: spell.messageInvisible,
    messageMiss: spell.messageMiss,
  }
}

export class Monster extends SerializableBase {
  static schema = MonsterSchema

  readonly name: string
  readonly plural?: string
  readonly base: MonsterBase
  readonly glyph: string
  readonly color: C
  readonly colorCycle
  readonly speed?: number
  readonly averageHp?: number
  readonly light?: number
  readonly hearing?: number
  readonly smell?: number
  readonly armorClass?: number
  readonly sleepiness?: number
  readonly depth?: number
  readonly rarity?: number
  readonly experience?: number
  readonly blows?: MonsterBlowParams[]
  readonly flags: Set<RF>
  // Hide these from end users; only used for serialization
  private readonly flagsOriginal: Set<RF>
  private readonly flagsOff: Set<RF>
  readonly innateFrequency?: number
  readonly spellFrequency?: number
  readonly spellPower?: number
  readonly spells?: MonsterSpellParams[]
  readonly description?: string
  readonly drop?: MonsterDropParams[]
  readonly dropBase?: MonsterDropBaseParams[]
  readonly mimic?: zItemParams[]
  readonly friends?: MonsterFriendParams[]
  readonly friendsBase?: MonsterFriendParams[]
  readonly shapes?: string[]

  constructor(params: MonsterParams) {
    super(params)

    this.name = params.name
    this.plural = params.plural
    this.base = params.base
    this.glyph = params.glyph || this.base.glyph
    this.color = params.color
    this.colorCycle = params.colorCycle
    this.speed = params.speed
    this.averageHp = params.averageHp
    this.light = params.light
    this.hearing = params.hearing
    this.smell = params.smell
    this.armorClass = params.armorClass
    this.sleepiness = params.sleepiness
    this.depth = params.depth
    this.rarity = params.rarity
    this.experience = params.experience
    this.blows = params.blows
    this.flagsOff = new Set(params.flagsOff)
    this.flagsOriginal = new Set(params.flags)
    this.flags = setUnion(
      setDifference(this.base.flags, this.flagsOff),
      this.flagsOriginal
    )
    this.innateFrequency = params.innateFrequency
    this.spellFrequency = params.spellFrequency
    this.spellPower = params.spellPower
    this.spells = params.spells
    this.description = params.description
    this.drop = params.drop
    this.dropBase = params.dropBase
    this.mimic = params.mimic
    this.friends = params.friends
    this.friendsBase = params.friendsBase
    this.shapes = params.shapes
  }

  register() {
    MonsterRegistry.add(this.name, this)
  }

  toJSON(): MonsterJSON {
    return {
      name: this.name,
      plural: this.plural,
      base: this.base.name,
      glyph: this.glyph,
      color: colorCodeToString(this.color),
      colorCycle: this.colorCycle,
      speed: this.speed,
      averageHp: this.averageHp,
      light: this.light,
      hearing: this.hearing,
      smell: this.smell,
      armorClass: this.armorClass,
      sleepiness: this.sleepiness,
      depth: this.depth,
      rarity: this.rarity,
      experience: this.experience,
      blows: this.blows?.map(blowToJson),
      flags: enumValueSetToArray(this.flagsOriginal, RF)!,
      flagsOff: enumValueSetToArray(this.flagsOff, RF)!,
      innateFrequency: this.innateFrequency,
      spellFrequency: this.spellFrequency,
      spellPower: this.spellPower,
      spells: this.spells?.map(spellToJson),
      description: this.description,
      drop: this.drop,
      dropBase: this.dropBase,
      mimic: this.mimic?.map(itemToJson),
      friends: this.friends?.map(friendToJson),
      friendsBase: this.friendsBase?.map(friendToJson),
      shapes: this.shapes,
    }
  }
}

export const MonsterRegistry = new NameRegistry(Monster)
