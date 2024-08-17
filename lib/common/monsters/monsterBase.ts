import { z } from 'zod'

import { RF } from './flags'
import { SerializableBase } from '../core/serializable'
import { JsonObject } from '../utilities/json'
import { z_enumValueParser } from '../utilities/zod'
import { valueSetToArray } from '../utilities/enum'

export const MonsterBaseSchema = z.object({
  name: z.string(),
  glyph: z.string().length(1),
  pain: z.number().nonnegative(),
  flags: z.array(z_enumValueParser(RF)),
  description: z.string()
})

export type MonsterBaseJSON = z.input<typeof MonsterBaseSchema>
export type MonsterBaseParams = z.output<typeof MonsterBaseSchema>

export class MonsterBase extends SerializableBase {
  static schema = MonsterBaseSchema

  readonly name: string
  readonly glyph: string
  readonly pain: number
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

  static fromJSON(parsed: JsonObject): MonsterBase {
    const params = MonsterBaseSchema.parse(parsed)

    return new MonsterBase(params)
  }

  toJSON(): JsonObject {
    return {
      name: this.name,
      glyph: this.glyph,
      pain: this.pain,
      flags: valueSetToArray(this.flags, RF),
      description: this.description,
    }
  }
}
