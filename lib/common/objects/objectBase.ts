import { z } from 'zod'
import { NameRegistry } from '../core/Registry'
import { SerializableBase } from '../core/serializable'

import { C } from '../utilities/colors'
import { objectValueToKey } from '../utilities/object'
import { TV, TV_NAMES } from './tval'
import { KF } from './kindFlags'
import { OF } from './flags'
import {
  HATES_ELEM,
  IGNORE_ELEM,
  isHatesElem, isIgnoreElem
} from '../spells/elements'
import { setToJson } from '../utilities/set'

type ObjectBaseFlag = keyof typeof KF | keyof typeof OF | HATES_ELEM | IGNORE_ELEM

export const ObjectBaseSchema = z.object({
  name: z.string().optional(),
  type: z.string().transform((str, ctx): TV => {
    // FIXME: Is there a more elegant way to accomplish this?
    const tval = TV_NAMES[str]
    if (tval) return tval

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'invalid TV name'
    })
    return z.NEVER
  }),
  graphics: z.nativeEnum(C),
  break: z.number().optional(),
  // Union of: KF, OF, and ELEM with 'HATES_' or 'IGNORE_'
  flags: z.array(z.string().transform((str, ctx): ObjectBaseFlag => {
    if (Object.keys(KF).includes(str)) {
      return str as keyof typeof KF
    } else if (Object.keys(OF).includes(str)) {
      return str as keyof typeof OF
    } else {
      if (isHatesElem(str)) return str
      else if (isIgnoreElem(str)) return str
    }

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'invalid flag type'
    })
    return z.NEVER
  })).optional(),
})

export type ObjectBaseJSON = z.input<typeof ObjectBaseSchema>
export type ObjectBaseParams = z.output<typeof ObjectBaseSchema>

export class ObjectBase extends SerializableBase {
  static schema = ObjectBaseSchema

  readonly name?: string
  readonly type: TV
  readonly typeName: keyof typeof TV_NAMES
  readonly graphics: C
  readonly break?: number
  readonly flags: Set<ObjectBaseFlag>

  constructor(params: ObjectBaseParams) {
    super(params)

    this.name = params.name
    this.type = params.type
    // Primary key
    // this lookup _will_ work, because we've already validated type
    this.typeName = objectValueToKey(this.type, TV_NAMES) as keyof typeof TV_NAMES
    this.graphics = params.graphics
    this.break = params.break
    this.flags = new Set(params.flags)
  }

  register() {
    // TODO: Check on how ObjectBases are referenced from elsewhere
    ObjectBaseRegistry.add(this.typeName, this)
  }

  toJSON(): ObjectBaseJSON {
    const type = objectValueToKey(this.type, TV_NAMES)
    if (type == null) throw new Error('invalid type for object base')
    return {
      name: this.name,
      type,
      graphics: this.graphics,
      break: this.break,
      flags: setToJson(this.flags),
    }
  }
}

export const ObjectBaseRegistry = new NameRegistry(ObjectBase)
