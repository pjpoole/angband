import { Parser } from './Parser'
import { asEnum, ParserValues } from '../../common/utilities/parsers'
import {
  MonsterBaseRegistry,
  SummonRegistry
} from '../../common/game/registries'
import { Summon, SummonJSON } from '../../common/spells/summons'

import { RF } from '../../common/monsters/flags'
import { MSG } from '../../common/game/messages'

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
