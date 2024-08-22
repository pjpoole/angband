import { Parser } from './Parser'
import {
  asTokens,
  ParserValues
} from '../../common/utilities/parsing/primitives'
import { allAsEnum } from '../../common/utilities/parsers'
import { arrayUnion } from '../../common/utilities/array'
import { colorStringToAttribute } from '../../common/utilities/colors'

import { Pit, PitJSON, PitRegistry } from '../../common/world/pit'

import { RF } from '../../common/monsters/flags'
import { MonsterBaseRegistry } from '../../common/monsters/monsterBase'
import { MonsterRegistry } from '../../common/monsters/monster'
import { RSF } from '../../common/monsters/spells'

type PitFields = 'name' | 'room' | 'alloc' | 'obj-rarity' | 'color' | 'mon-base'
  | 'flags-req' | 'flags-ban' | 'innate-freq' | 'spell-req' | 'spell-ban'
  | 'mon-ban'

export class PitParser extends Parser<PitFields, PitJSON> {
  static readonly fileName = 'pit'
  static readonly registry = PitRegistry

  constructor() {
    super()

    this.register('name', this.stringRecordHeader('name'))
    this.register('room', this.keyToInteger('room'))
    this.register('alloc', this.handleAllocation.bind(this))
    this.register('obj-rarity', this.keyToInteger('objectRarity'))
    this.register('color', this.handleColor.bind(this))
    this.register('mon-base', this.handleMonsterBases.bind(this))
    this.register('mon-ban', this.handleMonstersBanned.bind(this))
    this.register('flags-req', this.handleFlags.bind(this, 'flagsRequired'))
    this.register('flags-ban', this.handleFlags.bind(this, 'flagsBanned'))
    this.register('innate-freq', this.keyToInteger('innateFrequency'))
    this.register('spell-req', this.handleSpells.bind(this, 'spellsRequired'))
    this.register('spell-ban', this.handleSpells.bind(this, 'spellsBanned'))
  }

  _finalize(obj: PitJSON) {
    Pit.fromJSON(obj).register()
  }

  handleAllocation(values: ParserValues) {
    const current = this.current
    const [rarity, averageLevel] = asTokens(values, 2).map(token => parseInt(token))
    current.rarity = rarity
    current.averageLevel = averageLevel
  }

  handleColor(values: ParserValues) {
    const current = this.current
    current.colors = arrayUnion(current.colors ?? [], [colorStringToAttribute(values)])
  }

  handleMonsterBases(values: ParserValues) {
    const current = this.current
    if (!MonsterBaseRegistry.has(values)) {
      throw new Error('monster base not found', { cause: { key: values } })
    }

    current.monsterBases = arrayUnion(current.monsterBases ?? [], [values])
  }

  handleMonstersBanned(values: ParserValues) {
    return
    const current = this.current
    if (!MonsterRegistry.has(values)) {
      throw new Error('monster not found', { cause: { key: values } })
    }

    current.monstersBanned = arrayUnion(current.monstersBanned ?? [], [values])
  }

  handleFlags(key: 'flagsRequired' | 'flagsBanned', values: ParserValues) {
    const current = this.current
    current[key] = arrayUnion(current[key] ?? [], allAsEnum(values, RF))
  }

  handleSpells(key: 'spellsRequired' | 'spellsBanned', values: ParserValues) {
    const current = this.current
    current[key] = arrayUnion(current[key] ?? [], allAsEnum(values, RSF))
  }

}
