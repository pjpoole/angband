import { Parser } from './Parser'
import { asEnum, ParserValues } from '../../common/utilities/parsers'
import { ProjectionParams } from '../../common/spells/Projection'
import { ProjectionRegistry } from '../../common/game/registries'
import { ELEM } from '../../common/spells/elements'
import { MSG } from '../../common/game/messages'

type ProjectionFields = 'code' | 'name' | 'type' | 'desc' | 'player-desc'
  | 'blind-desc' | 'lash-desc' | 'numerator' | 'denominator' | 'divisor'
  | 'damage-cap' | 'msgt' | 'obvious' | 'wake' | 'color'

export class ProjectionParser extends Parser<ProjectionFields, ProjectionParams> {
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
    this.register('denominator', this.keyToString('denominator')) // TODO: dice
    this.register('divisor', this.keyToInteger('divisor'))
    this.register('damage-cap', this.keyToInteger('damageCap'))
    this.register('msgt', this.handleMessageType.bind(this))
    this.register('obvious', this.keyToBoolean('obvious'))
    this.register('wake', this.keyToBoolean('wake'))
    this.register('color', this.keyToColor('color'))
  }

  finalize() {
    this.finalizeCurrent()

    for (const obj of this.objects) {
      ProjectionRegistry.build(obj.name, obj)
    }
  }

  handleCode(value: ParserValues) {
    const current = this.newCurrent()
    current.code = asEnum(value, ELEM)
  }

  handleMessageType(value: ParserValues) {
    const current = this.current
    current.messageType = asEnum(value, MSG)
  }
}
