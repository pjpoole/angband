import { z } from 'zod'
import { IdRegistry } from '../core/Registry'
import { SerializableBase } from '../core/serializable'
import { z_enumValueParser } from '../utilities/zod/enums'
import { enumValueToKey } from '../utilities/enum'

import { PF } from './flags'
import { OF } from '../objects/flags'

export const PLAYER_PROPERTY_TYPES = ['player', 'object', 'element'] as const
export const RESIST_VALUES = [-1 , 1 , 3] as const

export type PlayerPropertyTypes = typeof PLAYER_PROPERTY_TYPES[number]
export type ResistValues = typeof RESIST_VALUES[number]

const PlayerPropertySchemaBase = z.object({
  bindui: z.string().optional(), // TODO
  name: z.string(),
  description: z.string(),
})

export const PlayerPropertySchema = z.discriminatedUnion('type', [
  PlayerPropertySchemaBase.merge(z.object({
    type: z.literal('player'),
    code: z_enumValueParser(PF),
    value: z.undefined(),
  })),
  PlayerPropertySchemaBase.merge(z.object({
    type: z.literal('object'),
    code: z_enumValueParser(OF),
    value: z.undefined(),
  })),
  PlayerPropertySchemaBase.merge(z.object({
    type: z.literal('element'),
    code: z.undefined(),
    value: z.number().refine(
      (num: number): num is ResistValues => RESIST_VALUES.includes(num as ResistValues),
      { message: 'invalid value' }
    ),
  }))
])

export type PlayerPropertyJSON = z.input<typeof PlayerPropertySchema>
export type PlayerPropertyParams = z.output<typeof PlayerPropertySchema>

export class PlayerProperty extends SerializableBase {
  static schema = PlayerPropertySchema

  readonly type: PlayerPropertyTypes
  readonly code: PF | OF | undefined
  readonly bindui?: string
  readonly name: string
  readonly description: string
  readonly value?: ResistValues

  constructor(params: PlayerPropertyParams) {
    super(params)

    this.type = params.type
    this.code = params.code
    this.bindui = params.bindui
    this.name = params.name
    this.description = params.description
    this.value = params.value
  }

  register() {
    PlayerPropertyRegistry.add(this.id, this)
  }

  toJSON(): PlayerPropertyJSON {
    const propertyBase = {
      bindui: this.bindui,
      name: this.name,
      description: this.description,
    }

    const type = this.type

    // Make sure the return type complies with the discriminated union
    switch (type) {
      case 'player':
        return {
          type,
          code: (enumValueToKey(this.code, PF) as keyof typeof PF),
          ...propertyBase,
          value: undefined,
        }
      case 'object':
        return {
          type,
          code: (enumValueToKey(this.code, OF) as keyof typeof OF),
          ...propertyBase,
          value: undefined,
        }
      case 'element':
        return {
          type,
          code: undefined,
          ...propertyBase,
          value: this.value as ResistValues,
        }
    }
  }
}

export const PlayerPropertyRegistry = new IdRegistry(PlayerProperty)
