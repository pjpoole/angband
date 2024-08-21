import { z } from 'zod'
import { IdRegistry } from '../core/Registry'
import { SerializableBase } from '../core/serializable'
import { enumValueToKey } from '../utilities/enum'
import { z_enumValueParser } from '../utilities/zod'

import { ELEM } from '../spells/elements'

export const PLAYER_PROPERTY_TYPES = ['player', 'object', 'environment'] as const
export const RESIST_VALUES = [-1 , 1 , 3] as const

export type PlayerPropertyTypes = typeof PLAYER_PROPERTY_TYPES[number]
export type ResistValues = typeof RESIST_VALUES[number]

export const PlayerPropertySchema = z.object({
  type: z.enum(PLAYER_PROPERTY_TYPES),
  code: z_enumValueParser(ELEM),
  name: z.string(),
  description: z.string(),
  value: z.number().refine(
    (num: number): num is ResistValues => RESIST_VALUES.includes(num as ResistValues),
    { message: 'invalid value'}
  ),
})

export type PlayerPropertyJSON = z.input<typeof PlayerPropertySchema>
export type PlayerPropertyParams = z.output<typeof PlayerPropertySchema>

export class PlayerProperty extends SerializableBase {
  static schema = PlayerPropertySchema

  readonly type: PlayerPropertyTypes
  readonly code: ELEM
  readonly name: string
  readonly description: string
  readonly value: ResistValues

  constructor(params: PlayerPropertyParams) {
    super(params)

    this.type = params.type
    this.code = params.code
    this.name = params.name
    this.description = params.description
    this.value = params.value
  }

  toJSON(): PlayerPropertyJSON {
    return {
      type: this.type,
      code: enumValueToKey(this.code, ELEM),
      name: this.name,
      description: this.description,
      value: this.value,
    }
  }
}

export const PlayerPropertyRegistry = new IdRegistry(PlayerProperty)
