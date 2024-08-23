import { z } from 'zod'
import { NameRegistry } from '../core/Registry'
import { SerializableBase } from '../core/serializable'

import { enumValueSetToArray } from '../utilities/serializing/enum'

import { z_enumValueParser } from '../utilities/zod/enums'

import { RF } from './flags'
import { Pain, PainRegistry } from './pain'

export const MonsterBaseSchema = z.object({
  name: z.string(),
  glyph: z.string().length(1),
  pain: z.number().transform((val, ctx) => {
    const pain = PainRegistry.get(val)
    if (pain != null) return pain

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'missing pain value',
    })
    return z.NEVER
  }),
  flags: z.array(z_enumValueParser(RF)).optional(),
  description: z.string()
})

export type MonsterBaseJSON = z.input<typeof MonsterBaseSchema>
export type MonsterBaseParams = z.output<typeof MonsterBaseSchema>

export class MonsterBase extends SerializableBase {
  static schema = MonsterBaseSchema

  readonly name: string
  readonly glyph: string
  readonly pain: Pain
  readonly flags: Set<RF>
  readonly description: string

  constructor(params: MonsterBaseParams) {
    super(params)

    this.name = params.name
    this.glyph = params.glyph
    this.pain = params.pain
    this.flags = new Set(params.flags)
    this.description = params.description
  }

  register() {
    MonsterBaseRegistry.add(this.name, this)
  }

  toJSON(): MonsterBaseJSON {
    return {
      name: this.name,
      glyph: this.glyph,
      pain: this.pain.type,
      flags: enumValueSetToArray(this.flags, RF),
      description: this.description,
    }
  }
}

export const MonsterBaseRegistry = new NameRegistry(MonsterBase)
