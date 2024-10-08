import { z } from 'zod'
import { NameRegistry } from '../core/Registry'
import { SerializableBase } from '../core/serializable'

import { enumValueToKey } from '../utilities/serializing/enum'

import { z_enumValueParser } from '../utilities/zod/enums'
import { z_monsterBase } from '../utilities/zod/monsterBase'

import { MSG } from '../game/messages'
import { RF } from '../monsters/flags'
import { MonsterBase } from '../monsters/monsterBase'

export const SummonSchema = z.object({
  name: z.string(), // pkey
  messageType: z_enumValueParser(MSG),
  uniques: z.boolean(),
  base: z_monsterBase.optional(),
  raceFlag: z_enumValueParser(RF).optional(), // TODO: maybe restrict to types? e.g. ANIMAL, DEMON, ...
  fallback: z.string().optional(),
  description: z.string(),
})

export type SummonJSON = z.input<typeof SummonSchema>
export type SummonParams = z.output<typeof SummonSchema>

export class Summon extends SerializableBase {
  static readonly schema = SummonSchema

  readonly name: string
  readonly messageType: MSG
  readonly uniques: boolean
  readonly base?: MonsterBase
  readonly raceFlag?: RF
  readonly fallback?: Summon
  readonly description: string

  constructor(params: SummonParams) {
    super(params)

    this.name = params.name
    this.messageType = params.messageType
    this.uniques = params.uniques
    this.base = params.base
    this.raceFlag = params.raceFlag
    // TODO: Circular dependency; maybe move to external caller
    this.fallback = params.fallback ? this.getFallback(params.fallback) : undefined
    this.description = params.description
  }

  private getFallback(fallback: string): Summon {
    // hack to peek in the registry, around safeties
    for (const summon of SummonRegistry.data.values()) {
      if (summon.name === fallback) return summon
    }
    throw new Error('invalid fallback')
  }

  register() {
    SummonRegistry.add(this.name, this)
  }

  toJSON(): SummonJSON {
    return {
      name: this.name,
      messageType: enumValueToKey(this.messageType, MSG),
      uniques: this.uniques,
      base: this.base?.name,
      raceFlag: enumValueToKey(this.raceFlag, RF),
      fallback: this.fallback?.name,
      description: this.description,
    }
  }
}

export const SummonRegistry = new NameRegistry(Summon)
