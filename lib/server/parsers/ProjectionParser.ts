import { Parser } from './Parser'
import { ParserValues } from '../../common/utilities/parsing/primitives'
import { asEnum, maybeAsEnum } from '../../common/utilities/parsing/enums'
import { JsonArray } from '../../common/utilities/json'

import {
  Projection,
  ProjectionJSON,
  ProjectionRegistry,
} from '../../common/spells/Projection'

import { MSG } from '../../common/game/messages'
import { ELEM } from '../../common/spells/elements'
import { PROJ } from '../../common/spells/projections'

type ProjectionFields = 'code' | 'name' | 'type' | 'desc' | 'player-desc'
  | 'blind-desc' | 'lash-desc' | 'numerator' | 'denominator' | 'divisor'
  | 'damage-cap' | 'msgt' | 'obvious' | 'wake' | 'color'

export class ProjectionParser extends Parser<ProjectionFields, ProjectionJSON> {
  static readonly fileName = 'projection'

  constructor() {
    super()

    this.register('code', this.handleCode.bind(this))
    this.register('name', this.keyToString('name'))
    this.register('type', this.keyToString('type'))
    this.register('desc', this.keyToString('description'))
    this.register('player-desc', this.keyToString('playerDescription'))
    this.register('blind-desc', this.keyToString('blindDescription'))
    this.register('lash-desc', this.keyToString('lashDescription'))
    this.register('numerator', this.keyToInteger('numerator'))
    this.register('denominator', this.keyToString('denominator'))
    this.register('divisor', this.keyToInteger('divisor'))
    this.register('damage-cap', this.keyToInteger('damageCap'))
    this.register('msgt', this.handleMessageType.bind(this))
    this.register('obvious', this.keyToBoolean('obvious'))
    this.register('wake', this.keyToBoolean('wake'))
    this.register('color', this.keyToColor('color'))
  }

  _finalizeItem(obj: ProjectionJSON) {
    Projection.fromJSON(obj).register()
  }

  toJSON(): JsonArray {
    return ProjectionRegistry.toJSON()
  }

  handleCode(value: ParserValues) {
    const current = this.newCurrent()
    const code = maybeAsEnum(value, ELEM)
    if (code) {
      current.code = code
    } else {
      current.code = asEnum(value, PROJ)
    }
  }

  handleMessageType(value: ParserValues) {
    const current = this.current
    current.messageType = asEnum(value, MSG)
  }
}
