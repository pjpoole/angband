import { z } from 'zod'
import { NameRegistry } from '../core/Registry'
import { SerializableBase } from '../core/serializable'

import { ifExists } from '../utilities/serializing/helpers'
import { blowLoreToJson } from '../utilities/serializing/lore'

import { z_blowLore, zBlowLoreParams } from '../utilities/zod/lore'

export const BlowEffectSchema = z.object({
  name: z.string(),
  power: z.number(),
  evaluation: z.number(),
  effectType: z.string().optional(), // TODO: finite set; const array
  resist: z.string().optional(), // OF or ELEM
  lashType: z.string().optional(), // TODO: validation
  lore: z_blowLore.optional(),
})

export type BlowEffectJSON = z.input<typeof BlowEffectSchema>
export type BlowEffectParams = z.output<typeof BlowEffectSchema>

export class BlowEffect extends SerializableBase {
  static readonly schema = BlowEffectSchema

  readonly name: string
  readonly power: number
  readonly evaluation: number
  readonly effectType?: string
  readonly resist?: string
  readonly lashType?: string
  readonly lore?: zBlowLoreParams

  constructor(params: BlowEffectParams) {
    super(params)

    this.name = params.name
    this.power = params.power
    this.evaluation = params.evaluation
    this.effectType = params.effectType
    this.resist = params.resist
    this.lashType = params.lashType
    this.lore = params.lore
  }

  register() {
    BlowEffectRegistry.add(this.name, this)
  }

  toJSON(): BlowEffectJSON {
    return {
      name: this.name,
      power: this.power,
      evaluation: this.evaluation,
      effectType: this.effectType,
      resist: this.resist,
      lashType: this.lashType,
      lore: ifExists(this.lore, blowLoreToJson),
    }
  }
}

export const BlowEffectRegistry = new NameRegistry(BlowEffect)
