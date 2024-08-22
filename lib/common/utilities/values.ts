import { OBJ_MOD } from '../objects/modifiers'
import { STAT } from '../player/stats'
import { ELEM, RESISTS_ELEM } from '../spells/elements'

import { Dice } from './dice'

// TODO: Move out of common/utilities once I understand what a "value" is

export interface StatJson {
  stat: keyof typeof STAT
  value: string
}

export interface ObjectModifierJson {
  stat: keyof typeof OBJ_MOD
  value: string
}

export interface ResistJson {
  stat: RESISTS_ELEM
  value: string
}

export interface StatParams {
  type: 'stat'
  stat: STAT
  value: Dice
}

export interface ObjectModifierParams {
  type: 'object'
  stat: OBJ_MOD
  value: Dice
}

export interface ResistParams {
  type: 'resist'
  stat: ELEM
  value: Dice
}

export type ValueJson = StatJson | ObjectModifierJson | ResistJson
export type ValueParams = StatParams | ObjectModifierParams | ResistParams
