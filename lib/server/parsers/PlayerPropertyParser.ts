import { Parser } from './Parser'
import {
  PLAYER_PROPERTY_TYPES,
  PlayerProperty,
  PlayerPropertyJSON,
  PlayerPropertyRegistry,
  RESIST_VALUES
} from '../../common/player/properties'
import {
  asArrayMember,
  asEnum,
  asInteger,
  ParserValues
} from '../../common/utilities/parsers'

import { PF } from '../../common/player/flags'
import { OF } from '../../common/objects/flags'

type PlayerPropertyFields = 'type' | 'code' | 'bindui' | 'name' | 'desc'
  | 'value'

export class PlayerPropertyParser extends Parser<PlayerPropertyFields, PlayerPropertyJSON> {
  static readonly fileName = 'player_property'
  static readonly registry = PlayerPropertyRegistry

  constructor() {
    super()

    this.register('name', this.keyToString('name'))
    this.register('code', this.handleCode.bind(this))
    this.register('bindui', this.keyToString('bindui'))
    this.register('type', this.handleType.bind(this))
    this.register('desc', this.keyToString('description'))
    this.register('value', this.handleValue.bind(this))
  }

  _finalize(obj: PlayerPropertyJSON) {
    PlayerProperty.fromJSON(obj).register()
  }

  // can't be pkey since codes overlap
  handleCode(value: ParserValues) {
    const current = this.current
    if (current.type === 'player') current.code = asEnum(value, PF)
    else if (current.type === 'object') current.code = asEnum(value, OF)
    else if (current.type === 'element') current.code = undefined
  }

  // Record header
  handleType(value: ParserValues) {
    const current = this.newCurrent()
    current.type = asArrayMember(value, PLAYER_PROPERTY_TYPES)
  }

  handleValue(value: ParserValues) {
    const current = this.current
    current.value = asArrayMember(asInteger(value), RESIST_VALUES)
  }
}
