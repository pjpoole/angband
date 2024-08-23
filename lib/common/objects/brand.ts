import { z } from 'zod'
import { NameRegistry } from '../core/Registry'
import { SerializableBase } from '../core/serializable'

import { z_enumValueParser } from '../utilities/zod/enums'

import { RF } from '../monsters/flags'
import { enumValueToKey } from '../utilities/serializing/enum'

export const BrandSchema = z.object({
  code: z.string(),
  name: z.string(), // TODO: lookup? would be in Projections, ELEM type
  multiplier: z.number(),
  zeroMultiplier: z.number(),
  power: z.number(),
  verb: z.string(),
  resistFlag: z_enumValueParser(RF),
  vulnerabilityFlag: z_enumValueParser(RF).optional(),
})

export type BrandJSON = z.input<typeof BrandSchema>
export type BrandParams = z.output<typeof BrandSchema>

export class Brand extends SerializableBase {
  static readonly schema = BrandSchema

  readonly code: string
  readonly name: string
  readonly multiplier: number
  readonly zeroMultiplier: number
  readonly power: number
  readonly verb: string
  readonly resistFlag: RF
  readonly vulnerabilityFlag?: RF

  constructor(params: BrandParams) {
    super(params)

    this.code = params.code
    this.name = params.name
    this.multiplier = params.multiplier
    this.zeroMultiplier = params.zeroMultiplier
    this.power = params.power
    this.verb = params.verb
    this.resistFlag = params.resistFlag
    this.vulnerabilityFlag = params.vulnerabilityFlag
  }

  register() {
    BrandRegistry.add(this.code, this)
  }

  toJSON(): BrandJSON {
    return {
      code: this.code,
      name: this.name,
      multiplier: this.multiplier,
      zeroMultiplier: this.zeroMultiplier,
      power: this.power,
      verb: this.verb,
      resistFlag: enumValueToKey(this.resistFlag, RF),
      vulnerabilityFlag: enumValueToKey(this.vulnerabilityFlag, RF),
    }
  }
}

export const BrandRegistry = new NameRegistry(Brand)
