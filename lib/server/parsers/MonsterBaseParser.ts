import { Parser } from './Parser'
import { ParserValues } from '../../common/utilities/parsing/primitives'
import { allAsEnum } from '../../common/utilities/parsing/enums'
import { arrayUnion } from '../../common/utilities/array'

import { RF } from '../../common/monsters/flags'
import { MonsterBase, MonsterBaseJSON } from '../../common/monsters/monsterBase'

type MonsterBaseFields = 'name' | 'glyph' | 'pain' | 'flags' | 'desc'

export class MonsterBaseParser extends Parser<MonsterBaseFields, MonsterBaseJSON> {
  static readonly fileName = 'monster_base'

  constructor() {
    super()

    this.register('name', this.stringRecordHeader('name'))
    this.register('glyph', this.handleGlyph.bind(this))
    this.register('pain', this.keyToInteger('pain'))
    this.register('flags', this.handleFlags.bind(this))
    this.register('desc', this.keyToString('description'))
  }

  _finalizeItem(obj: MonsterBaseJSON): void {
    MonsterBase.fromJSON(obj).register()
  }

  handleGlyph(value: ParserValues) {
    const current = this.current
    // ensure it's one character
    current.glyph = value.slice(0, 1)
  }

  handleFlags(value: ParserValues) {
    const current = this.current
    current.flags = arrayUnion(current.flags ?? [], allAsEnum(value, RF))
  }
}
