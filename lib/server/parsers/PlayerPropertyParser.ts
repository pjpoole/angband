import { Parser, ParserValues } from './Parser'
import {
  PLAYER_PROPERTY_TYPES,
  PlayerPropertyParams, RESIST_VALUES
} from '../../common/player/properties'
import { PlayerPropertyRegistry } from '../../common/game/registries'
import { valueAsElem, valueAsInteger, valueIsInArray } from './parsers'

type PlayerPropertyFields = 'type' | 'code' | 'name' | 'desc' | 'value'

export class PlayerPropertyParser extends Parser<PlayerPropertyFields, PlayerPropertyParams> {
  constructor() {
    super()

    this.register('code', this.handleCode.bind(this))
    this.register('name', this.keyToString('name'))
    this.register('type', this.handleType.bind(this))
    this.register('desc', this.keyToString('description'))
    this.register('value', this.handleValue.bind(this))
  }

  finalize() {
    for (const obj of this.objects) {
      PlayerPropertyRegistry.build(obj.name, obj)
    }
  }

  handleCode(value: ParserValues) {
    const current = this.newCurrent()
    current.code = valueAsElem(value)
  }

  handleType(value: ParserValues) {
    const current = this.current

    if (!valueIsInArray(value, PLAYER_PROPERTY_TYPES)) {
      throw new Error('invalid value', { cause: { value } })
    }

    current.type = value
  }

  handleValue(value: ParserValues) {
    const current = this.current

    const numeric = valueAsInteger(value)

    if (!valueIsInArray(numeric, RESIST_VALUES)) {
      throw new Error('invalid value', { cause: { value } })
    }

    current.value = numeric
  }
}
