import { Parser, ParserValues } from './Parser'
import type { MonsterBase } from '../../common/monsters/monsterBase'
import type { RF } from '../../common/monsters/flags'
import { MonsterBaseRegistry } from '../../common/game/registries'
import { setDifference, setUnion } from '../../common/utilities/set'
import type { C } from '../../common/utilities/colors'
import {
  keyToColor,
  keyToInteger,
  keyToPercentile,
  keyToString,
  keyToUnsigned,
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
  averageHp: number
  light: number
  hearing: number
  smell: number
  armorClass: number
  sleepiness: number
  level: number
  rarity: number
  experience: number
  blow: string[][] // TODO
  flags: Set<RF>
  flagsOff?: Set<RF>
  innateFrequency: number
  spellFrequency: number
  spellPower: number
  spells: string[][] // TODO
  messageVisible: string
  messageInvisible: string
  messageMiss: string
  description: string
  drop: string[][] // TODO
  dropBase: string[][] // TODO
  mimic: [string, string]
  friends: string[][] // TODO
  friendsBase: string[][] // TODO
}

export class MonsterParser extends Parser<MonsterFields, MonsterSpec> {
  constructor() {
    super()

    this.register('name', this.handleName.bind(this))
    this.register('plural', keyToString<MonsterSpec>('plural').bind(this))
    this.register('base', this.handleBase.bind(this))
    this.register('glyph', this.handleGlyph.bind(this))
    this.register('color', keyToColor<MonsterSpec>('color').bind(this))
    this.register('speed', keyToInteger<MonsterSpec>('speed').bind(this))
    this.register('hit-points', keyToInteger<MonsterSpec>('averageHp').bind(this))
    this.register('light', keyToInteger<MonsterSpec>('light').bind(this))
    this.register('hearing', keyToInteger<MonsterSpec>('hearing').bind(this))
    this.register('smell', keyToInteger<MonsterSpec>('smell').bind(this))
    this.register('armor-class', keyToInteger<MonsterSpec>('armorClass').bind(this))
    this.register('sleepiness', keyToInteger<MonsterSpec>('sleepiness').bind(this))
    this.register('depth', this.handleDepth.bind(this))
    this.register('rarity', keyToInteger<MonsterSpec>('rarity').bind(this))
    this.register('experience', keyToInteger<MonsterSpec>('experience').bind(this))
    this.register('blow', this.handleBlow.bind(this))
    this.register('flags', this.handleFlags.bind(this))
    this.register('flags-off', this.handleFlagsOff.bind(this))
    this.register('desc', keyToString<MonsterSpec>('description').bind(this))
    this.register('innate-freq', keyToPercentile<MonsterSpec>('innateFrequency').bind(this))
    this.register('spell-freq', keyToPercentile<MonsterSpec>('spellFrequency').bind(this))
    this.register('spell-power', keyToUnsigned<MonsterSpec>('spellPower').bind(this))
    this.register('spells', this.handleSpells.bind(this))
    this.register('message-vis', this.handleMessageVisible.bind(this))
    this.register('message-invis', this.handleMessageInvisible.bind(this))
    this.register('message-miss', this.handleMessageMiss.bind(this))
    this.register('drop', this.handleDrop.bind(this))
    this.register('drop-base', this.handleDropBase.bind(this))
    this.register('friends', this.handleFriends.bind(this))
    this.register('friends-base', this.handleFriendsBase.bind(this))
    this.register('mimic', this.handleMimic.bind(this))
    this.register('shape', this.handleShape.bind(this))
    this.register('color-cycle', this.handleColorCycle.bind(this))
  }

  // TODO
  finalize() {

  }

  handleName(value: ParserValues) {
    if (this.hasCurrent()) {
      this.finalizeCurrent()
    }
    const current = this.newCurrent()
    current.name = value
  }

  handleBase(value: ParserValues) {
    const current = this.current

    const base = MonsterBaseRegistry.get(value)

    if (base == null) throw new Error('monster base not found', { cause: { key: value } })

    current.glyph = base.glyph
    current.flags = setUnion(current.flags || new Set(), base.flags)
  }

  handleGlyph(value: ParserValues) {
    const current = this.current

    // override base glyph; this relies on glyph being specified after base in
    // the data file
    current.glyph = value[0]
  }

  handleDepth(value: ParserValues) {
    const current = this.current
    current.level = valueAsInteger(value)

    // Level is default spell power
    current.spellPower = current.level
  }

  // TODO
  handleBlow(value: ParserValues) {
    const current = this.current
  }

  handleFlags(value: ParserValues) {
    const current = this.current

    if (current.flags == null) current.flags = new Set<RF>()

    current.flags = setUnion(current.flags, valueAsRF(value))
  }

  handleFlagsOff(value: ParserValues) {
    const current = this.current

    if (current.flags == null) current.flags = new Set<RF>()

    current.flags = setDifference(current.flags, valueAsRF(value))
  }

  // TODO
  handleSpells(value: ParserValues) {
    const current = this.current
  }

  // TODO
  handleMessageVisible(value: ParserValues) {
    const current = this.current
  }

  // TODO
  handleMessageInvisible(value: ParserValues) {
    const current = this.current
  }

  // TODO
  handleMessageMiss(value: ParserValues) {
    const current = this.current
  }

  // TODO
  handleDrop(value: ParserValues) {
    const current = this.current
  }

  // TODO
  handleDropBase(value: ParserValues) {
    const current = this.current
  }

  // TODO
  handleFriends(value: ParserValues) {
    const current = this.current
  }

  // TODO
  handleFriendsBase(value: ParserValues) {
    const current = this.current
  }

  // TODO
  handleMimic(value: ParserValues) {
    const current = this.current
  }

  // TODO
  handleShape(value: ParserValues) {
    const current = this.current
  }

  // TODO
  handleColorCycle(value: ParserValues) {
    const current = this.current
  }

  // TODO
}
