import { z } from 'zod'

import { SerializableBase } from '../core/serializable'

import { ELEM } from './elements'
import { MSG } from '../game/messages'
import { C } from '../utilities/colors'
import { JsonObject } from '../utilities/json'

export const ProjectionSchema = z.object({
  code: z.nativeEnum(ELEM),
  name: z.string(),
  type: z.string(),
  description: z.string(),
  playerDescription: z.string(),
  blindDescription: z.string(),
  lashDescription: z.string(),
  numerator: z.number(),
  denominator: z.string(),
  divisor: z.number(),
  damageCap: z.number(),
  messageType: z.nativeEnum(MSG),
  obvious: z.boolean(),
  wake: z.boolean(),
  color: z.nativeEnum(C)
})

export type ProjectionParams = z.infer<typeof ProjectionSchema>

export class Projection implements SerializableBase {
  readonly code: ELEM
  readonly name: string
  readonly type: string
  readonly description: string
  readonly playerDescription: string
  readonly blindDescription: string
  readonly lashDescription: string
  readonly numerator: number
  readonly denominator: string
  readonly divisor: number
  readonly damageCap: number
  readonly messageType: MSG
  readonly obvious: boolean
  readonly wake: boolean
  readonly color: C

  constructor(params: ProjectionParams) {
    this.code = params.code
    this.name = params.name
    this.type = params.type
    this.description = params.description
    this.playerDescription = params.playerDescription
    this.blindDescription = params.blindDescription
    this.lashDescription = params.lashDescription
    this.numerator = params.numerator
    this.denominator = params.denominator
    this.divisor = params.divisor
    this.damageCap = params.damageCap
    this.messageType = params.messageType
    this.obvious = params.obvious
    this.wake = params.wake
    this.color = params.color
  }

  static fromJSON(parsed: JsonObject): Projection {
    const params = ProjectionSchema.parse(parsed)

    return new Projection(params)
  }

  toJSON(): JsonObject {
    return {
      code: ELEM[this.code],
      name: this.name,
      type: this.type,
      description: this.description,
      playerDescription: this.playerDescription,
      blindDescription: this.blindDescription,
      lashDescription: this.lashDescription,
      numerator: this.numerator,
      denominator: this.denominator,
      divisor: this.divisor,
      damageCap: this.damageCap,
      messageType: MSG[this.messageType],
      obvious: this.obvious,
      wake: this.wake,
      color: C[this.color]
    }
  }
}
