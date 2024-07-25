import type { GameObject } from '../GameObject'
import { ELEM } from './elements'
import { MSG } from '../game/messages'
import { C } from '../utilities/colors'

export interface ProjectionParams extends GameObject {
  code: ELEM
  name: string
  type: string
  description: string
  playerDescription: string
  blindDescription: string
  lashDescription: string
  numerator: number
  denominator: string
  divisor: number
  damageCap: number
  messageType: MSG
  obvious: boolean
  wake: boolean
  color: C
}

export class Projection {
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
}
