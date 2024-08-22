import { Parser } from './Parser'
import { asEnum } from '../../common/utilities/parsers'
import { ParserValues } from '../../common/utilities/parsing/primitives'

import { MSG } from '../../common/game/messages'
import { Blow, BlowJSON, BlowRegistry } from '../../common/monsters/blows'

type BlowFields = 'name' | 'cut' | 'stun' | 'miss' | 'phys' | 'msg' | 'act'
  | 'desc'

export class BlowParser extends Parser<BlowFields, BlowJSON> {
  static readonly fileName = 'blow_methods'
  static readonly registry = BlowRegistry

  constructor() {
    super()

    this.register('name', this.stringRecordHeader('name'))
    this.register('cut', this.keyToBoolean('cut'))
    this.register('stun', this.keyToBoolean('stun'))
    this.register('miss', this.keyToBoolean('miss'))
    this.register('phys', this.keyToBoolean('physical'))
    this.register('msg', this.handleMessage.bind(this))
    this.register('act', this.handleActions.bind(this))
    this.register('desc', this.keyToString('description'))
  }

  _finalize(obj: BlowJSON) {
    Blow.fromJSON(obj).register()
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
