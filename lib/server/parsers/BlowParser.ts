import { Blow, BlowJSON } from '../../common/monsters/blows'
import { MSG } from '../../common/game/messages'
import { BlowRegistry } from '../../common/game/registries'
import { Parser } from './Parser'
import { asEnum, ParserValues } from '../../common/utilities/parsers'

type BlowFields = 'name' | 'cut' | 'stun' | 'miss' | 'phys' | 'msg' | 'act'
  | 'desc'

export class BlowParser extends Parser<BlowFields, BlowJSON> {
  static readonly fileName = 'blow_methods'
  static readonly registry = BlowRegistry

  constructor() {
    super()

    this.register('name', this.handleName.bind(this))
    this.register('cut', this.keyToBoolean('cut'))
    this.register('stun', this.keyToBoolean('stun'))
    this.register('miss', this.keyToBoolean('miss'))
    this.register('phys', this.keyToBoolean('physical'))
    this.register('msg', this.handleMessage.bind(this))
    this.register('act', this.handleActions.bind(this))
    this.register('desc', this.keyToString('description'))
  }

  _finalize(obj: BlowJSON) {
    const blow = Blow.fromJSON(obj)
    BlowRegistry.add(blow.name, blow)
  }

  handleName(values: ParserValues) {
    this.newCurrent()
    this.keyToSingleString('name')(values)
  }

  handleActions(values: ParserValues) {
    const current = this.current
    current.actions ??= []
    current.actions.push(values)
  }

  handleMessage(values: ParserValues) {
    const current = this.current
    current.message = asEnum(values, MSG)
  }
}
