import { z } from 'zod'
import { NameRegistry } from '../core/Registry'
import { SerializableBase } from '../core/serializable'

import { z_effectObject, zEffectObjectParams } from '../utilities/zod/effect'

import { effectObjectsToJson } from '../utilities/serializing/effect'

export const ActivationSchema = z.object({
  name: z.string(),
  aim: z.boolean(),
  power: z.number(),
  effects: z.array(z_effectObject),
  message: z.string().optional(),
  description: z.string().optional(),
})

export type ActivationJSON = z.input<typeof ActivationSchema>
export type ActivationParams = z.output<typeof ActivationSchema>

export class Activation extends SerializableBase {
  static readonly schema = ActivationSchema

  readonly name: string
  readonly aim: boolean
  readonly power: number
  readonly effects: zEffectObjectParams[]
  readonly description?: string

  constructor(params: ActivationParams) {
    super(params)

    this.name = params.name
    this.aim = params.aim
    this.power = params.power
    this.effects = params.effects
    this.description = params.description
  }

  register() {
    ActivationRegistry.add(this.name, this)
  }

  toJSON(): ActivationJSON {
    return {
      name: this.name,
      aim: this.aim,
      power: this.power,
      effects: effectObjectsToJson(this.effects),
      description: this.description,
    }
  }

}

export const ActivationRegistry = new NameRegistry(Activation)
