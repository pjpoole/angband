import { z } from 'zod'
import { IdRegistry } from '../core/Registry'
import { SerializableBase } from '../core/serializable'

export const PainSchema = z.object({
  type: z.number(),
  messages: z.array(z.string()),
})

export type PainJSON = z.input<typeof PainSchema>
export type PainParams = z.output<typeof PainSchema>

export class Pain extends SerializableBase {
  static readonly schema = PainSchema

  readonly type: number
  readonly messages: string[]

  constructor(params: PainParams) {
    super(params)

    this.type = params.type
    this.messages = params.messages
  }

  register() {
    PainRegistry.add(this.type, this)
  }

  toJSON(): PainJSON {
    return {
      type: this.type,
      messages: this.messages,
    }
  }
}

export const PainRegistry = new IdRegistry(Pain)
