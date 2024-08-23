import { Parser } from './Parser'
import { ParserValues } from '../../common/utilities/parsing/primitives'
import { allAsEnum } from '../../common/utilities/parsing/enums'

import {
  ROOMF,
  RoomTemplate,
  RoomTemplateJSON,
  RoomTemplateRegistry
} from '../../common/world/roomTemplate'

import { TV_NAMES } from '../../common/objects/tval'
import { arrayUnion } from '../../common/utilities/array'

type RoomTemplateFields = 'name' | 'type' | 'rating' | 'rows' | 'columns'
  | 'doors' | 'tval' | 'flags' | 'D'

export class RoomTemplateParser extends Parser<RoomTemplateFields, RoomTemplateJSON> {
  static readonly fileName = 'room_template'
  static readonly registry = RoomTemplateRegistry

  constructor() {
    super()

    this.register('name', this.stringRecordHeader('name'))
    this.register('type', this.keyToInteger('type'))
    this.register('rating', this.keyToInteger('rating'))
    this.register('rows', this.keyToInteger('rows'))
    this.register('columns', this.keyToInteger('columns'))
    this.register('doors', this.keyToInteger('doors'))
    this.register('tval', this.handleTval.bind(this))
    this.register('flags', this.handleFlags.bind(this))
    this.register('D', this.handleRoom.bind(this))
  }

  _finalize(obj: RoomTemplateJSON) {
    RoomTemplate.fromJSON(obj).register()
  }

  handleTval(values: ParserValues) {
    const current = this.current
    if (values === '0') return
    if (TV_NAMES[values] == null) throw new Error('invalid object type')
    current.tval = values
  }

  handleFlags(values: ParserValues) {
    const current = this.current
    current.flags = arrayUnion(current.flags ?? [], allAsEnum(values, ROOMF))
  }

  handleRoom(values: ParserValues) {
    const current = this.current
    current.room ??= []
    current.room.push(values)
  }

}
