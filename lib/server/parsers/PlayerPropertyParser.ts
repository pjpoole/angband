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
import { ELEM } from '../../common/spells/elements'

type PlayerPropertyFields = 'type' | 'code' | 'name' | 'desc' | 'value'

export class PlayerPropertyParser extends Parser<PlayerPropertyFields, PlayerPropertyJSON> {
  constructor() {
    super()

    this.register('code', this.handleCode.bind(this))
    this.register('name', this.keyToString('name'))
    this.register('type', this.handleType.bind(this))
    this.register('desc', this.keyToString('description'))
    this.register('value', this.handleValue.bind(this))
  }

  _finalize(obj: PlayerPropertyJSON) {
    const playerProperty = PlayerProperty.fromJSON(obj)
    PlayerPropertyRegistry.add(playerProperty.code, playerProperty)
  }

  handleCode(value: ParserValues) {
    const current = this.newCurrent()
    current.code = asEnum(value, ELEM)
  }

  handleType(value: ParserValues) {
    const current = this.current
    current.type = asArrayMember(value, PLAYER_PROPERTY_TYPES)
  }

  handleValue(value: ParserValues) {
    const current = this.current
    current.value = asArrayMember(asInteger(value), RESIST_VALUES)
  }
}
