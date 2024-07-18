import { Parser, ParserValues } from './Parser'
import type { MonsterBase } from '../../common/monsters/monsterBase'
import type { RF } from '../../common/monsters/flags'
import { MonsterBaseRegistry } from '../../common/game/registries'
import { setDifference, setUnion } from '../../common/utilities/set'
import { C, colorStringToAttribute } from '../../common/utilities/colors'
import {
  keyToInteger, keyToPercentile, keyToString, keyToUnsigned,
  valueAsColor,
  valueAsInteger,
  valueAsRF
} from './parsers'

type MonsterFields = 'name' | 'plural' | 'base' | 'glyph' | 'color' | 'speed'
  | 'hit-points' | 'light' | 'hearing' | 'smell' | 'armor-class' | 'sleepiness'
  | 'depth' | 'rarity' | 'experience' | 'blow' | 'flags' | 'flags-off'
  | 'innate-freq' | 'spell-freq' | 'spell-power' | 'spells' | 'message-vis'
  | 'message-invis' | 'message-miss' | 'desc' | 'drop' | 'drop-base' | 'mimic'
  | 'friends' | 'friends-base' | 'shape' | 'color-cycle'

interface MonsterSpec {
  name: string
  plural?: string
  base: MonsterBase
  glyph?: string // char
  color: C
  speed: number
  hitPoints: number
  light: number
  hearing: number
  armorClass: number
  sleepiness: number
  level: number
  rarity: number
  experience: number
  blow: string[][] // TODO
  flags: Set<RF>
  flagsOff?: Set<RF>
  innateFreq: number
  spellFreq: number
  spellPower: number
  spells: string[][] // TODO
  messageVisible: string
  messageInvisible: string
  messageMiss: string
  desc: string
  drop: string[][] // TODO
  dropBase: string[][] // TODO
  mimic: [string, string]
  friends: string[][] // TODO
  friendsBase: string[][] // TODO
}

export class MonsterParser extends Parser<MonsterFields, MonsterSpec> {
  constructor() {
    super()

    this.register('name', this.handleMonsterName.bind(this))
    this.register('plural', keyToString('plural').bind(this))
    this.register('base', this.handleMonsterBase.bind(this))
    this.register('glyph', this.handleMonsterGlyph.bind(this))
    this.register('color', this.handleMonsterColor.bind(this))
    this.register('speed', keyToInteger('speed').bind(this))
    this.register('hit-points', keyToInteger('averageHp').bind(this))
    this.register('light', keyToInteger('light').bind(this))
    this.register('hearing', keyToInteger('hearing').bind(this))
    this.register('smell', keyToInteger('smell').bind(this))
    this.register('armor-class', keyToInteger('armorClass').bind(this))
    this.register('sleepiness', keyToInteger('sleepiness').bind(this))
    this.register('depth', this.handleMonsterDepth.bind(this))
    this.register('rarity', keyToInteger('rarity').bind(this))
    this.register('experience', keyToInteger('experience').bind(this))
    this.register('blow', this.handleMonsterBlow.bind(this))
    this.register('flags', this.handleMonsterFlags.bind(this))
    this.register('flags-off', this.handleMonsterFlagsOff.bind(this))
    this.register('desc', keyToString('description').bind(this))
    this.register('innate-freq', keyToPercentile('innateFrequency').bind(this))
    this.register('spell-freq', keyToPercentile('spellFrequency').bind(this))
    this.register('spell-power', keyToUnsigned('spellPower').bind(this))
    this.register('spells', this.handleMonsterSpells.bind(this))
    this.register('message-vis', this.handleMonsterMessageVisible.bind(this))
    this.register('message-invis', this.handleMonsterMessageInvisible.bind(this))
    this.register('message-miss', this.handleMonsterMessageMiss.bind(this))
    this.register('drop', this.handleMonsterDrop.bind(this))
    this.register('drop-base', this.handleMonsterDropBase.bind(this))
    this.register('friends', this.handleMonsterFriends.bind(this))
    this.register('friends-base', this.handleMonsterFriendsBase.bind(this))
    this.register('mimic', this.handleMonsterMimic.bind(this))
    this.register('shape', this.handleMonsterShape.bind(this))
    this.register('color-cycle', this.handleMonsterColorCycle.bind(this))
  }

  // TODO
  finalize() {

  }

  handleMonsterName(value: ParserValues) {
    if (this.hasCurrent()) {
      this.finalizeCurrent()
    }
    const current = this.newCurrent()
    current.name = value
  }

  handleMonsterBase(value: ParserValues) {
    const current = this.current

    const base = MonsterBaseRegistry.get(value)

    if (base == null) throw new Error('monster base not found', { cause: { key: value } })

    current.glyph = base.glyph
    current.flags = setUnion(current.flags || new Set(), base.flags)
  }

  handleMonsterGlyph(value: ParserValues) {
    const current = this.current

    // override base glyph; this relies on glyph being specified after base in
    // the data file
    current.glyph = value[0]
  }

  handleMonsterColor(value: ParserValues) {
    const current = this.current
    current.color = colorStringToAttribute(value)
  }

  handleMonsterDepth(value: ParserValues) {
    const current = this.current
    current.level = valueAsInteger(value)

    // Level is default spell power
    current.spellPower = current.level
  }

  // TODO
  handleMonsterBlow(value: ParserValues) {
    const current = this.current
  }

  handleMonsterFlags(value: ParserValues) {
    const current = this.current

    if (current.flags == null) current.flags = new Set<RF>()

    current.flags = setUnion(current.flags, valueAsRF(value))
  }

  handleMonsterFlagsOff(value: ParserValues) {
    const current = this.current

    if (current.flags == null) current.flags = new Set<RF>()

    current.flags = setDifference(current.flags, valueAsRF(value))
  }

  // TODO
  handleMonsterSpells(value: ParserValues) {
    const current = this.current
  }

  // TODO
  handleMonsterMessageVisible(value: ParserValues) {
    const current = this.current
  }

  // TODO
  handleMonsterMessageInvisible(value: ParserValues) {
    const current = this.current
  }

  // TODO
  handleMonsterMessageMiss(value: ParserValues) {
    const current = this.current
  }

  // TODO
  handleMonsterDrop(value: ParserValues) {
    const current = this.current
  }

  // TODO
  handleMonsterDropBase(value: ParserValues) {
    const current = this.current
  }

  // TODO
  handleMonsterFriends(value: ParserValues) {
    const current = this.current
  }

  // TODO
  handleMonsterFriendsBase(value: ParserValues) {
    const current = this.current
  }

  // TODO
  handleMonsterMimic(value: ParserValues) {
    const current = this.current
  }

  // TODO
  handleMonsterShape(value: ParserValues) {
    const current = this.current
  }

  // TODO
  handleMonsterColorCycle(value: ParserValues) {
    const current = this.current
  }

  // TODO
}
