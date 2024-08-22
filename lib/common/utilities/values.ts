import { OBJ_MOD } from '../objects/modifiers'
import { STAT } from '../player/stats'
import { ELEM, RESISTS_ELEM } from '../spells/elements'

// TODO: Move out of common/utilities once I understand what a "value" is

export interface StatJson {
  stat: keyof typeof STAT
  value: number
}

export interface ObjectModifierJson {
  stat: keyof typeof OBJ_MOD
  value: number
}

export interface ResistJson {
  stat: RESISTS_ELEM
  value: number
}

export interface StatParams {
  type: 'stat'
  stat: STAT
  value: number
}

export interface ObjectModifierParams {
  type: 'object'
  stat: OBJ_MOD
  value: number
}

export interface ResistParams {
  type: 'resist'
  stat: ELEM
  value: number
}

export type ValueJson = StatJson | ObjectModifierJson | ResistJson
export type ValueParams = StatParams | ObjectModifierParams | ResistParams
