import { MonsterBaseRegistry } from '../../common/game/registries'
import { RF } from '../../common/monsters/flags'
import { MonsterBase, MonsterBaseJSON } from '../../common/monsters/monsterBase'
import { arrayUnion } from '../../common/utilities/array'
import { Parser } from './Parser'
import { allAsEnum, ParserValues } from '../../common/utilities/parsers'

type MonsterBaseFields = 'name' | 'glyph' | 'pain' | 'flags' | 'desc'

export class MonsterBaseParser extends Parser<MonsterBaseFields, MonsterBaseJSON> {
  constructor() {
    super()

    this.register('name', this.handleMonsterName.bind(this))
    this.register('glyph', this.handleMonsterGlyph.bind(this))
    this.register('pain', this.keyToInteger('pain'))
    this.register('flags', this.handleMonsterFlags.bind(this))
    this.register('desc', this.keyToString('description'))
  }

  finalize(): void {
    for (const obj of this.objects) {
      const monsterBase = MonsterBase.fromJSON(obj)
      MonsterBaseRegistry.add(obj.name, monsterBase)
    }
  }

  handleMonsterName(value: ParserValues) {
    const current = this.newCurrent()
    current.name = value
  }

  handleMonsterGlyph(value: ParserValues) {
    const current = this.current
    // ensure it's one character
    current.glyph = value.slice(0, 1)
  }

  handleMonsterFlags(value: ParserValues) {
    const current = this.current

    if (current.flags == null) current.flags = []

    current.flags = arrayUnion(current.flags, allAsEnum(value, RF))
  }
}
