import { z } from 'zod'
import { NameRegistry } from '../core/Registry'
import { SerializableBase } from '../core/serializable'

import { setToJson } from '../utilities/serializing/set'

import { z_color } from '../utilities/zod/color'
import { ObjectBaseFlag, z_objectBaseFlag } from '../utilities/zod/flags'
import { z_tVal } from '../utilities/zod/tVal'

import { C, colorCodeToString } from '../utilities/colors'
import { objectValueToKey } from '../utilities/object'
import { type TV, TV_NAMES } from './tval'

export const ObjectBaseSchema = z.object({
  name: z.string().optional(),
  type: z_tVal,
  color: z_color,
  break: z.number().optional(),
  flags: z.array(z_objectBaseFlag).optional(),
})

export type ObjectBaseJSON = z.input<typeof ObjectBaseSchema>
export type ObjectBaseParams = z.output<typeof ObjectBaseSchema>

export class ObjectBase extends SerializableBase {
  static schema = ObjectBaseSchema

  readonly name?: string
  readonly type: TV
  readonly typeName: keyof typeof TV_NAMES
  readonly color: C
  readonly break?: number
  readonly flags: Set<ObjectBaseFlag>

  constructor(params: ObjectBaseParams) {
    super(params)

    this.name = params.name
    this.type = params.type
    // Primary key
    // this lookup _will_ work, because we've already validated type
    this.typeName = objectValueToKey(this.type, TV_NAMES) as keyof typeof TV_NAMES
    this.color = params.color
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
      color: colorCodeToString(this.color),
      break: this.break,
      flags: setToJson(this.flags),
    }
  }
}

export const ObjectBaseRegistry = new NameRegistry(ObjectBase)
