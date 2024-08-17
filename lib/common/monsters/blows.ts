import { z } from 'zod'
import { MON_MESSAGES, MSG } from '../game/messages'
import { SerializableBase } from '../core/serializable'
import { valueToKeyOrThrow } from '../utilities/enum'

export const BlowSchema = z.object({
  name: z.string(),
  cut: z.boolean(),
  stun: z.boolean(),
  miss: z.boolean(),
  physical: z.boolean(),
  message: z.string().refine(str => MON_MESSAGES.includes(str as `MON_${string}`)),
  action: z.string(),
  description: z.string(),
})

export type BlowJSON = z.input<typeof BlowSchema>
export type BlowParams = z.output<typeof BlowSchema>

export class Blow extends SerializableBase {
  static schema = BlowSchema

  readonly name: string
  readonly cut: boolean
  readonly stun: boolean
  readonly miss: boolean
  readonly physical: boolean
  readonly message: MSG
  readonly action: string
  readonly description: string

  constructor(params: BlowParams) {
    super(params)

    this.name = params.name
    this.cut = params.cut
    this.stun = params.stun
    this.miss = params.miss
    this.physical = params.physical
    this.message = MSG[params.message as keyof typeof MSG]
    this.action = params.action
    this.description = params.description
  }

  toJSON(): BlowJSON {
    return {
      name: this.name,
      cut: this.cut,
      stun: this.stun,
      miss: this.miss,
      physical: this.physical,
      message: valueToKeyOrThrow(this.message, MSG),
      action: this.action,
      description: this.description,
    }
  }
}
