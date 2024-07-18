import { MonsterBaseRegistry } from '../../common/game/registries'
import { RF } from '../../common/monsters/flags'
import { setUnion } from '../../common/utilities/set'

import { Parser, ParserValues } from './Parser'
import { keyToInteger, keyToString, valueAsRF } from './parsers'

type MonsterBaseFields = 'name' | 'glyph' | 'pain' | 'flags' | 'desc'

interface MonsterBaseSpec {
  name: string
  glyph: string
  pain: number
  flags: Set<RF>
  description: string
}

export class MonsterBaseParser extends Parser<MonsterBaseFields, MonsterBaseSpec> {
  constructor() {
    super()

    this.register('name', this.handleMonsterName.bind(this))
    this.register('glyph', this.handleMonsterGlyph.bind(this))
    this.register('pain', keyToInteger('pain').bind(this))
    this.register('flags', this.handleMonsterFlags.bind(this))
    this.register('desc', keyToString('description').bind(this))
  }

  finalize(): void {
    for (const obj of this.objects) {
      MonsterBaseRegistry.build(obj.name, obj)
    }
  }

  handleMonsterName(value: ParserValues) {
    if (this.hasCurrent()) {
      this.finalizeCurrent()
    }
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

    if (current.flags == null) current.flags = new Set<RF>()

    current.flags = setUnion(current.flags, valueAsRF(value))
  }
}
