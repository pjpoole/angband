import { z } from 'zod'
import { NameRegistry } from '../core/Registry'
import { SerializableBase } from '../core/serializable'
import { z_diceExpression } from '../utilities/zod/dice'
import { z_enumValueParser } from '../utilities/zod/enums'
import { setDifference, setUnion } from '../utilities/set'

import { C } from '../utilities/colors'
import { Dice } from '../utilities/dice'

import { Blow, BLOW_EF, BlowRegistry } from './blows'
import { RF } from './flags'
import { MonsterBase, MonsterBaseRegistry } from './monsterBase'
import { RSF } from './spells'

const messageObject = z.array(z.object({
  spell: z_enumValueParser(RSF),
  message: z.string()
})).optional()

const friendRoles = ['servant', 'bodyguard'] as const

export const MonsterSchema = z.object({
  name: z.string(),
  plural: z.string().optional(),
  base: z.string(),
  glyph: z.string().length(1).optional(),
  color: z.nativeEnum(C),
  speed: z.number(),
  averageHp: z.number(),
  light: z.number(),
  hearing: z.number(),
  smell: z.number(),
  armorClass: z.number(),
  sleepiness: z.number(),
  level: z.number(),
  rarity: z.number(),
  experience: z.number(),
  blows: z.array(z.object({
    blow: z.string().transform((str, ctx) => {
      const blow = BlowRegistry.get(str)
      if (blow != null) return blow

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'invalid blow'
      })
      return z.NEVER
    }),
    effect: z_enumValueParser(BLOW_EF).optional(),
    damage: z_diceExpression().optional(),
  })),
  flags: z.array(z_enumValueParser(RF)),
  flagsOff: z.array(z_enumValueParser(RF)).optional(),
  innateFrequency: z.number(),
  spellFrequency: z.number(),
  spellPower: z.number(),
  spells: z.array(z_enumValueParser(RSF)),
  messageVisible: messageObject,
  messageInvisible: messageObject,
  messageMiss: messageObject,
  description: z.string(),
  drop: z.array(z.object({
    type: z.string(), // TODO: validate against object types
    name: z.string(), // TODO: validate
    chance: z.number(),
    min: z.number(),
    max: z.number(),
  }).refine(
    (drop) => drop.min <= drop.max,
    { message: 'improper values for drop min/max'}
  )).optional(),
  dropBase: z.array(z.object({
    type: z.string(), // TODO: validate
    chance: z.number(),
    min: z.number(),
    max: z.number(),
  })).optional(),
  mimic: z.array(z.object({
    type: z.string(), // TODO: validate
    item: z.string(), // TODO: validate
  })).optional(),
  // friends:Chance of friend appearing:number in xdy format:name of friend
  friends: z.array(z.object({
    chance: z.number(),
    count: z_diceExpression(),
    type: z.string(), // TODO: self-validate; introspects monster data. Also
                      //       note that 'same' is valid value and refers to this
    role: z.enum(friendRoles).optional(),
  })).optional(),
  friendsBase: z.array(z.object({
    chance: z.number(),
    count: z_diceExpression(),
    baseType: z.string(), // TODO: validate,
    role: z.enum(friendRoles).optional(),
  })).optional(),
})

export type MonsterJSON = z.input<typeof MonsterSchema>
export type MonsterParams = z.output<typeof MonsterSchema>

interface MonsterBlow {
  blow: Blow,
  effect?: BLOW_EF,
  damage?: Dice,
}

interface MonsterMessage {
  spell: RSF,
  message: string,
}

interface MonsterDropBase {
  type: string // TODO: Object type
  chance: number
  min: number
  max: number
}

interface MonsterDrop extends MonsterDropBase {
  name: string // TODO: validate
}

interface MonsterMimic {
  type: string // TODO: validate
  item: string // TODO: validate
}

interface MonsterFriendBase {
  chance: number
  count: Dice
  baseType: string // TODO: validate
  role?: typeof friendRoles[number]
}

interface MonsterFriend {
  chance: number
  count: Dice
  type: string // TODO: validate
  role?: typeof friendRoles[number]
}

export class Monster extends SerializableBase {
  static schema = MonsterSchema

  readonly name: string
  readonly plural?: string
  readonly base: MonsterBase
  readonly glyph: string
  readonly color: C
  readonly speed: number
  readonly averageHp: number
  readonly light: number
  readonly hearing: number
  readonly smell: number
  readonly armorClass: number
  readonly sleepiness: number
  readonly level: number
  readonly rarity: number
  readonly experience: number
  readonly blows: MonsterBlow[]
  readonly flags: Set<RF>
  readonly innateFrequency: number
  readonly spellFrequency: number
  readonly spellPower: number
  readonly spells: RSF[]
  readonly messageVisible: MonsterMessage[]
  readonly messageInvisible: MonsterMessage[]
  readonly messageMiss: MonsterMessage[]
  readonly description: string
  readonly drop: MonsterDrop[]
  readonly dropBase: MonsterDropBase[]
  readonly mimic: MonsterMimic[]
  readonly friends: MonsterFriend[]
  readonly friendsBase: MonsterFriendBase[]

  constructor(params: MonsterParams) {
    super(params)

    this.name = params.name
    this.plural = params.plural
    this.base = MonsterBaseRegistry.getOrThrow(params.base)
    this.glyph = params.glyph || this.base.glyph
    this.color = params.color
    this.speed = params.speed
    this.averageHp = params.averageHp
    this.light = params.light
    this.hearing = params.hearing
    this.smell = params.smell
    this.armorClass = params.armorClass
    this.sleepiness = params.sleepiness
    this.level = params.level
    this.rarity = params.rarity
    this.experience = params.experience
    this.blows = params.blows,
    this.flags = setUnion(
      setDifference(this.base.flags, new Set(params.flagsOff)),
      new Set(params.flags)
    )
    this.innateFrequency = params.innateFrequency
    this.spellFrequency = params.spellFrequency
    this.spellPower = params.spellPower
    this.spells = params.spells
    this.messageVisible = params.messageVisible ?? []
    this.messageInvisible = params.messageInvisible ?? []
    this.messageMiss = params.messageMiss ?? []
    this.description = params.description
    this.drop = params.drop ?? []
    this.dropBase = params.dropBase ?? []
    this.mimic = params.mimic ?? []
    this.friends = params.friends ?? []
    this.friendsBase = params.friendsBase ?? []
  }

  register() {
    MonsterRegistry.add(this.name, this)
  }
}

export const MonsterRegistry = new NameRegistry(Monster)
