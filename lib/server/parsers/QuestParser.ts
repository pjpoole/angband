import { Parser } from './Parser'
import { ParserValues } from '../../common/utilities/parsing/primitives'

import { Quest, QuestJSON } from '../../common/game/quest'
import { MonsterRegistry } from '../../common/monsters/monster'

type QuestFields = 'name' | 'level' | 'race' | 'number'

export class QuestParser extends Parser<QuestFields, QuestJSON> {
  static readonly fileName = 'quest'

  constructor() {
    super()

    this.register('name', this.stringRecordHeader('name'))
    this.register('level', this.keyToInteger('level'))
    this.register('race', this.handleRace.bind(this))
    this.register('number', this.keyToInteger('number'))
  }

  _finalizeItem(obj: QuestJSON) {
    Quest.fromJSON(obj).register()
  }

  handleRace(values: ParserValues) {
    const current = this.current
    if (!MonsterRegistry.has(values)) {
      throw new Error('monster not found', { cause: { key: values } })
    }

    current.race = values
  }
}
