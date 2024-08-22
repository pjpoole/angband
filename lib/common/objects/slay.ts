import { z } from 'zod'
import { NameRegistry } from '../core/Registry'
import { SerializableBase } from '../core/serializable'

import { z_enumValueParser } from '../utilities/zod/enums'

import { RF } from '../monsters/flags'
import { enumValueToKey } from '../utilities/serializing/enum'

export const SlaySchema = z.object({
  code: z.string(),
  name: z.string(),
  raceFlag: z_enumValueParser(RF),
  multiplier: z.number(),
  zeroMultiplier: z.number(),
  power: z.number(),
  meleeVerb: z.string(),
  rangeVerb: z.string(),
})

export type SlayJSON = z.input<typeof SlaySchema>
export type SlayParams = z.output<typeof SlaySchema>

export class Slay extends SerializableBase {
  static readonly schema = SlaySchema

  readonly code: string
  readonly name: string
  readonly raceFlag: RF
  readonly multiplier: number
  readonly zeroMultiplier: number
  readonly power: number
  readonly meleeVerb: string
  readonly rangeVerb: string

  constructor(params: SlayParams) {
    super(params)

    this.code = params.code
    this.name = params.name
    this.raceFlag = params.raceFlag
    this.multiplier = params.multiplier
    this.zeroMultiplier = params.zeroMultiplier
    this.power = params.power
    this.meleeVerb = params.meleeVerb
    this.rangeVerb = params.rangeVerb
  }

  register() {
    SlayRegistry.add(this.code, this)
  }

  toJSON() {
    return {
      code: this.code,
      name: this.name,
      raceFlag: enumValueToKey(this.raceFlag, RF),
      multiplier: this.multiplier,
      zeroMultiplier: this.zeroMultiplier,
      power: this.power,
      meleeVerb: this.meleeVerb,
      rangeVerb: this.rangeVerb,
    }
  }
}

export const SlayRegistry = new NameRegistry(Slay)
