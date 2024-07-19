import { Parser, ParserValues } from './Parser'
import {
  PLAYER_PROPERTY_TYPES,
  PlayerPropertyParams, RESIST_VALUES
} from '../../common/player/properties'
import { PlayerPropertyRegistry } from '../../common/game/registries'
import { valueAsInteger, valueIsInArray } from './parsers'

type PlayerPropertyFields = 'type' | 'code' | 'name' | 'desc' | 'value'

export class PlayerPropertyParser extends Parser<PlayerPropertyFields, PlayerPropertyParams> {
  constructor() {
    super()

    this.register('type', this.handleType.bind(this))
    this.register('value', this.handleValue.bind(this))
  }

  finalize() {
    for (const obj of this.objects) {
      PlayerPropertyRegistry.build(obj.name, obj)
    }
  }

  handleType(value: ParserValues) {
    const current = this.newCurrent()

    if (!valueIsInArray(value, PLAYER_PROPERTY_TYPES)) {
      throw new Error('invalid value', { cause: { value } })
    }

    current.type = value
  }

  handleValue(value: ParserValues) {
    const current = this.newCurrent()

    const numeric = valueAsInteger(value)

    if (!valueIsInArray(numeric, RESIST_VALUES)) {
      throw new Error('invalid value', { cause: { value } })
    }

    current.value = numeric
  }
}
