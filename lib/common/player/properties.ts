import { ELEM } from '../spells/elements'

export const PLAYER_PROPERTY_TYPES = ['player', 'object', 'environment'] as const
export const RESIST_VALUES = [-1 , 1 , 3] as const

export type PlayerPropertyTypes = typeof PLAYER_PROPERTY_TYPES[number]
export type ResistValues = typeof RESIST_VALUES[number]

export interface PlayerPropertyParams {
  type: PlayerPropertyTypes
  code: ELEM
  name: string
  description: string
  value: ResistValues
}

export class PlayerProperty {
  readonly type: PlayerPropertyTypes
  readonly code: ELEM
  readonly name: string
  readonly description: string
  readonly value: ResistValues

  constructor(params: PlayerPropertyParams) {
    this.type = params.type
    this.code = params.code
    this.name = params.name
    this.description = params.description
    this.value = params.value
  }
}
