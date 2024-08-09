import { z } from 'zod'

import { RF } from './flags'
import { SerializableBase } from '../core/serializable'
import { JsonObject } from '../utilities/json'

export const MonsterBaseSchema = z.object({
  name: z.string(),
  glyph: z.string().length(1),
  pain: z.number(),
  flags: z.array(z.nativeEnum(RF)),
  description: z.string()
})

export type MonsterBaseParams = z.infer<typeof MonsterBaseSchema>

export class MonsterBase implements SerializableBase {
  readonly name: string
  readonly glyph: string
  readonly pain: number
  readonly flags: Set<RF>
  readonly description: string

  constructor(params: MonsterBaseParams) {
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
      flags: Array.from(this.flags.keys()),
      description: this.description,
    }
  }
}
