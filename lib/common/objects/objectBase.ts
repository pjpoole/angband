import { z } from 'zod'
import { SerializableBase } from '../core/serializable'

import { C } from '../utilities/colors'
import { TV, TV_NAMES } from './tval'
import { Entries } from '../utilities/object'

export const ObjectBaseSchema = z.object({
  name: z.string(),
  type: z.string().transform((str, ctx): TV => {
    // FIXME: Is there a more elegant way to accomplish this?
    for (const [k, v] of Object.entries(TV_NAMES) as unknown as Entries<typeof TV_NAMES>) {
      if (v === str) return k
    }

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'invalid TV name'
    })
    return z.NEVER
  }),
  graphics: z.nativeEnum(C),
  break: z.number().optional(),
  // Union of: KF, OF, and ELEM with 'HATES_' or 'IGNORE_'
  flags: z.array(z.string()).optional(),
})

export type ObjectBaseJSON = z.input<typeof ObjectBaseSchema>
export type ObjectBaseParams = z.output<typeof ObjectBaseSchema>

export class ObjectBase extends SerializableBase {
  static schema = ObjectBaseSchema

  readonly name: string
  readonly type: TV
  readonly graphics: C
  readonly break?: number
  readonly flags: Set<string>

  constructor(params: ObjectBaseParams) {
    super(params)

    this.name = params.name
    this.type = params.type
    this.graphics = params.graphics
    this.break = params.break
    this.flags = new Set(params.flags)
  }

  toJSON(): ObjectBaseJSON {
    return {
      name: this.name,
      type: TV_NAMES[this.type],
      graphics: this.graphics,
      break: this.break,
      flags: Array.from(this.flags),
    }
  }
}
