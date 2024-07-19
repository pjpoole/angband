import { Parser, ParserValues } from './Parser'
import {
  keyToBoolean,
  keyToColor,
  keyToInteger,
  keyToString,
  valueAsElem,
  valueAsMsg
} from './parsers'
import { ProjectionParams } from '../../common/spells/Projection'

type ProjectionFields = 'code' | 'name' | 'type' | 'desc' | 'player-desc'
  | 'blind-desc' | 'lash-desc' | 'numerator' | 'denominator' | 'divisor'
  | 'damage-cap' | 'msgt' | 'obvious' | 'wake' | 'color'

export class ProjectionParser extends Parser<ProjectionFields, ProjectionParams> {
  constructor() {
    super()

    this.register('code', this.handleCode.bind(this))
    this.register('name', keyToString<ProjectionParams>('name').bind(this))
    this.register('type', keyToString<ProjectionParams>('type').bind(this))
    this.register('desc', keyToString<ProjectionParams>('description').bind(this))
    this.register('player-desc', keyToString<ProjectionParams>('playerDescription').bind(this))
    this.register('blind-desc', keyToString<ProjectionParams>('blindDescription').bind(this))
    this.register('lash-desc', keyToString<ProjectionParams>('lashDescription').bind(this))
    this.register('numerator', keyToInteger<ProjectionParams>('numerator').bind(this))
    this.register('denominator', keyToString<ProjectionParams>('denominator').bind(this)) // TODO: dice
    this.register('divisor', keyToInteger<ProjectionParams>('divisor').bind(this))
    this.register('damage-cap', keyToInteger<ProjectionParams>('damageCap').bind(this))
    this.register('msgt', this.handleMessageType.bind(this))
    this.register('obvious', keyToBoolean<ProjectionParams>('obvious').bind(this))
    this.register('wake', keyToBoolean<ProjectionParams>('wake').bind(this))
    this.register('color', keyToColor<ProjectionParams>('color').bind(this))
  }

  finalize() {

  }

  handleCode(value: ParserValues) {
    const current = this.newCurrent()
    current.code = valueAsElem(value)
  }

  handleMessageType(value: ParserValues) {
    const current = this.current
    current.messageType = valueAsMsg(value)
  }
}
