import { Parser } from './Parser'
import { ParserValues } from '../../common/utilities/parsing/primitives'
import { asEnum } from '../../common/utilities/parsing/enums'

import { Summon, SummonJSON, SummonRegistry } from '../../common/spells/summons'

import { MSG } from '../../common/game/messages'
import { RF } from '../../common/monsters/flags'
import { MonsterBaseRegistry } from '../../common/monsters/monsterBase'

type SummonFields = 'name' | 'msgt' | 'uniques' | 'base' | 'race-flag'
  | 'fallback' | 'desc'

export class SummonParser extends Parser<SummonFields, SummonJSON> {
  static readonly fileName = 'summon'
  static readonly registry = SummonRegistry

  constructor() {
    super()

    this.register('name', this.stringRecordHeader('name'))
    this.register('msgt', this.handleMessageType.bind(this))
    this.register('uniques', this.keyToBoolean('uniques'))
    this.register('base', this.handleBase.bind(this))
    this.register('race-flag', this.handleRaceFlag.bind(this))
    this.register('fallback', this.handleFallback.bind(this))
    this.register('desc', this.keyToString('description'))
  }

  _finalize(obj: SummonJSON) {
    Summon.fromJSON(obj).register()
  }

  handleMessageType(values: ParserValues) {
    const current = this.current
    current.messageType = asEnum(values, MSG)
  }

  handleBase(values: ParserValues) {
    const current = this.current

    if (!MonsterBaseRegistry.has(values)) {
      throw new Error('monster base not found', { cause: { key: values } })
    }

    current.base = values
  }

  handleRaceFlag(values: ParserValues) {
    const current = this.current
    current.raceFlag = asEnum(values, RF)
  }

  handleFallback(values: ParserValues) {
    const current = this.current
    for (const json of this.objects) {
      if (json.name === values) {
        current.fallback = values
        return
      }
    }

    throw new Error('summon fallback not found')
  }

}
