import { z } from 'zod'
import { NameRegistry } from '../core/Registry'
import { SerializableBase } from '../core/serializable'
import { z_enumValueParser } from '../utilities/zod/enums'
import { enumValueSetToArray } from '../utilities/enum'

import { Monster, MonsterRegistry } from '../monsters/monster'

import { C } from '../utilities/colors'
import { RF } from '../monsters/flags'
import { MonsterBase, MonsterBaseRegistry } from '../monsters/monsterBase'
import { RSF } from '../monsters/spells'

const monsterBaseFinder = z.string().transform((str, ctx) => {
  const monsterBase = MonsterBaseRegistry.get(str)
  if (monsterBase != null) return monsterBase

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: 'invalid monster base type'
  })
  return z.NEVER
})

const monsterFinder = z.string().transform((str, ctx) => {
  const monster = MonsterRegistry.get(str)
  if (monster != null) return monster

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: 'invalid monster type'
  })
  return z.NEVER
})

// TODO: Spells, flags, monsters, monster bases
export const PitSchema = z.object({
  name: z.string(),
  room: z.number().int().gte(1).lte(3), // TODO: where do these come from?
  rarity: z.number(),
  averageLevel: z.number(),
  objectRarity: z.number().optional(),
  colors: z.array(z.nativeEnum(C)).optional(),
  monsterBases: z.array(monsterBaseFinder).optional(),
  monstersBanned: z.array(monsterFinder).optional(),
  flagsRequired: z.array(z_enumValueParser(RF)).optional(),
  flagsBanned: z.array(z_enumValueParser(RF)).optional(),
  innateFrequency: z.number().optional(),
  spellsRequired: z.array(z_enumValueParser(RSF)).optional(),
  spellsBanned: z.array(z_enumValueParser(RSF)).optional(),
})

export type PitJSON = z.input<typeof PitSchema>
export type PitParams = z.output<typeof PitSchema>

export class Pit extends SerializableBase {
  static readonly schema = PitSchema

  readonly name: string
  readonly room: number
  readonly rarity: number
  readonly averageLevel: number
  readonly objectRarity?: number
  readonly colors?: C[]
  readonly monsterBases: Set<MonsterBase>
  readonly monstersBanned: Set<Monster>
  readonly flagsRequired: Set<RF>
  readonly flagsBanned: Set<RF>
  readonly innateFrequency?: number
  readonly spellsRequired: Set<RSF>
  readonly spellsBanned: Set<RSF>

  constructor(params: PitParams) {
    super(params)

    this.name = params.name
    this.room = params.room
    this.rarity = params.rarity
    this.averageLevel = params.averageLevel
    this.objectRarity = params.objectRarity
    this.colors = params.colors
    this.monsterBases = new Set(params.monsterBases)
    this.monstersBanned = new Set(params.monstersBanned)
    this.flagsRequired = new Set(params.flagsRequired)
    this.flagsBanned = new Set(params.flagsBanned)
    this.innateFrequency = params.innateFrequency
    this.spellsRequired = new Set(params.spellsRequired)
    this.spellsBanned = new Set(params.spellsBanned)
  }

  register() {
    PitRegistry.add(this.name, this)
  }

  toJSON(): PitJSON {
    return {
      name: this.name,
      room: this.room,
      rarity: this.rarity,
      averageLevel: this.averageLevel,
      objectRarity: this.objectRarity,
      colors: this.colors,
      monsterBases: this.monsterBases.size > 0 ? Array.from(this.monsterBases).map(monsterBase => monsterBase.name) : undefined,
      monstersBanned: this.monstersBanned.size > 0 ? Array.from(this.monstersBanned).map(monsterbase => monsterbase.name) : undefined,
      flagsRequired: enumValueSetToArray(this.flagsRequired, RF),
      flagsBanned: enumValueSetToArray(this.flagsBanned, RF),
      innateFrequency: this.innateFrequency,
      spellsRequired: enumValueSetToArray(this.spellsRequired, RSF),
      spellsBanned: enumValueSetToArray(this.spellsBanned, RSF),
    }
  }
}

export const PitRegistry = new NameRegistry(Pit)
