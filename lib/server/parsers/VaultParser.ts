import { Parser } from './Parser'
import { ParserValues } from '../../common/utilities/parsing/primitives'
import { allAsEnum } from '../../common/utilities/parsing/enums'
import { JsonArray } from '../../common/utilities/json'

import { Vault, VaultJSON, VaultRegistry } from '../../common/world/vault'

import { ROOMF } from '../../common/world/roomTemplate'
import { arrayUnion } from '../../common/utilities/array'

type VaultFields = 'name' | 'type' | 'rating' | 'rows' | 'columns'
  | 'min-depth' | 'max-depth' | 'flags' | 'D'

export class VaultParser extends Parser<VaultFields, VaultJSON> {
  static readonly fileName = 'vault'

  constructor() {
    super()

    this.register('name', this.stringRecordHeader('name'))
    this.register('type', this.keyToString('type'))
    this.register('rating', this.keyToInteger('rating'))
    this.register('rows', this.keyToInteger('rows'))
    this.register('columns', this.keyToInteger('columns'))
    this.register('min-depth', this.keyToInteger('minDepth'))
    this.register('max-depth', this.keyToInteger('maxDepth'))
    this.register('flags', this.handleFlags.bind(this))
    this.register('D', this.handleRoom.bind(this))
  }

  _finalizeItem(obj: VaultJSON) {
    Vault.fromJSON(obj).register()
  }

  toJSON(): JsonArray {
    return VaultRegistry.toJSON()
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
