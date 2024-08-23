import { Parser } from './Parser'

import { asEnum } from '../../common/utilities/parsing/enums'
import { ParserValues } from '../../common/utilities/parsing/primitives'
import { JsonArray } from '../../common/utilities/json'

import { Slay, SlayJSON, SlayRegistry } from '../../common/objects/slay'

import { RF } from '../../common/monsters/flags'

type SlayFields = 'code' | 'name' | 'race-flag' | 'multiplier' | 'o-multiplier'
 | 'power' | 'melee-verb' | 'range-verb'

export class SlayParser extends Parser<SlayFields, SlayJSON> {
  static readonly fileName = 'slay'

  constructor() {
    super()

    this.register('code', this.stringRecordHeader('code'))
    this.register('name', this.keyToString('name'))
    this.register('race-flag', this.handleRaceFlag.bind(this))
    this.register('multiplier', this.keyToInteger('multiplier'))
    this.register('o-multiplier', this.keyToInteger('zeroMultiplier'))
    this.register('power', this.keyToInteger('power'))
    this.register('melee-verb', this.keyToString('meleeVerb'))
    this.register('range-verb', this.keyToString('rangeVerb'))
  }

  _finalizeItem(obj: SlayJSON) {
    Slay.fromJSON(obj).register()
  }

  toJSON(): JsonArray {
    return SlayRegistry.toJSON()
  }

  handleRaceFlag(values: ParserValues) {
    const current = this.current
    current.raceFlag = asEnum(values, RF)
  }
}
