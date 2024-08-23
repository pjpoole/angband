import { Parser } from './Parser'
import {
  asFlags,
  asInteger,
  asTokens,
  ParserValues
} from '../../common/utilities/parsing/primitives'
import {
  allAsEnum,
  asEnum,
  maybeAsEnum
} from '../../common/utilities/parsing/enums'
import { arrayUnion } from '../../common/utilities/array'

import { Monster, MonsterJSON } from '../../common/monsters/monster'

import { RF } from '../../common/monsters/flags'
import { MonsterBaseRegistry } from '../../common/monsters/monsterBase'
import { BLOW_EF, BlowRegistry } from '../../common/monsters/blows'
import { RSF } from '../../common/monsters/spells'
import { TV_NAMES } from '../../common/objects/tval'

type MonsterFields = 'name' | 'plural' | 'base' | 'glyph' | 'color' | 'speed'
  | 'hit-points' | 'light' | 'hearing' | 'smell' | 'armor-class' | 'sleepiness'
  | 'depth' | 'rarity' | 'experience' | 'blow' | 'flags' | 'flags-off'
  | 'innate-freq' | 'spell-freq' | 'spell-power' | 'spells' | 'message-vis'
  | 'message-invis' | 'message-miss' | 'desc' | 'drop' | 'drop-base' | 'mimic'
  | 'friends' | 'friends-base' | 'shape' | 'color-cycle'

export class MonsterParser extends Parser<MonsterFields, MonsterJSON> {
  static readonly fileName = 'monster'

  constructor() {
    super()

    this.register('name', this.stringRecordHeader('name'))
    this.register('plural', this.keyToString('plural'))
    this.register('base', this.handleBase.bind(this))
    this.register('glyph', this.handleGlyph.bind(this))
    this.register('color', this.keyToColor('color'))
    this.register('speed', this.keyToInteger('speed'))
    this.register('hit-points', this.keyToInteger('averageHp'))
    this.register('light', this.keyToInteger('light'))
    this.register('hearing', this.keyToInteger('hearing'))
    this.register('smell', this.keyToInteger('smell'))
    this.register('armor-class', this.keyToInteger('armorClass'))
    this.register('sleepiness', this.keyToInteger('sleepiness'))
    this.register('depth', this.handleDepth.bind(this))
    this.register('rarity', this.keyToInteger('rarity'))
    this.register('experience', this.keyToInteger('experience'))
    this.register('blow', this.handleBlow.bind(this))
    this.register('flags', this.handleFlags.bind(this))
    this.register('flags-off', this.handleFlagsOff.bind(this))
    this.register('desc', this.keyToString('description'))
    this.register('innate-freq', this.keyToPercentile('innateFrequency'))
    this.register('spell-freq', this.keyToPercentile('spellFrequency'))
    this.register('spell-power', this.keyToUnsigned('spellPower'))
    this.register('spells', this.handleSpells.bind(this))
    this.register('message-vis', this.handleMessageVisible.bind(this))
    this.register('message-invis', this.handleMessageInvisible.bind(this))
    this.register('message-miss', this.handleMessageMiss.bind(this))
    this.register('drop', this.handleDrop.bind(this))
    this.register('drop-base', this.handleDropBase.bind(this))
    this.register('friends', this.handleFriends.bind(this, 'friends'))
    this.register('friends-base', this.handleFriends.bind(this, 'friendsBase'))
    this.register('mimic', this.handleMimic.bind(this))
    this.register('shape', this.handleShape.bind(this))
    this.register('color-cycle', this.handleColorCycle.bind(this))
  }

  _finalizeItem(obj: MonsterJSON) {
    Monster.fromJSON(obj).register()
  }

  handleBase(value: ParserValues) {
    const current = this.current

    if (!MonsterBaseRegistry.has(value)) {
      throw new Error('monster base not found', { cause: { key: value } })
    }

    current.base = value
  }

  handleGlyph(value: ParserValues) {
    const current = this.current
    // override base glyph; this relies on glyph being specified after base in
    // the data file
    current.glyph = value[0]
  }

  handleDepth(value: ParserValues) {
    const current = this.current
    current.depth = asInteger(value)

    // Level is default spell power
    current.spellPower = current.depth
  }

  handleBlow(value: ParserValues) {
    const current = this.current
    const [blow, effect, damage] = asTokens(value, 1, 3)
    if (!BlowRegistry.has(blow)) {
      throw new Error('invalid blow')
    }

    current.blows ??= []
    current.blows.push({ blow, effect: maybeAsEnum(effect, BLOW_EF), damage })
  }

  handleFlags(value: ParserValues) {
    const current = this.current
    current.flags = arrayUnion(current.flags ?? [], allAsEnum(value, RF))
  }

  handleFlagsOff(value: ParserValues) {
    const current = this.current
    current.flagsOff = arrayUnion(current.flagsOff ?? [], allAsEnum(value, RF))
  }

  handleSpells(value: ParserValues) {
    const current = this.current
    const spells = asFlags(value).map(spell => ({ spell: asEnum(spell, RSF) }))

    current.spells ??= []
    current.spells.push(...spells)
  }

  handleMessageVisible(value: ParserValues) {
    const [name, message] = asTokens(value, 2)
    const spell = this.getSpellByName(name)
    spell.messageVisible = message
  }

  handleMessageInvisible(value: ParserValues) {
    const [name, message] = asTokens(value, 2)
    const spell = this.getSpellByName(name)
    spell.messageInvisible = message
  }

  handleMessageMiss(value: ParserValues) {
    const [name, message] = asTokens(value, 2)
    const spell = this.getSpellByName(name)
    spell.messageMiss = message
  }

  handleDrop(value: ParserValues) {
    const current = this.current
    const [tval, sval, chance, min, max] = asTokens(value, 5)

    current.drop ??= []
    current.drop.push({
      tval,
      sval,
      chance: asInteger(chance),
      min: asInteger(min),
      max: asInteger(max),
    })
  }

  handleDropBase(value: ParserValues) {
    const current = this.current
    const [tval, chance, min, max] = asTokens(value, 4)

    current.dropBase ??= []
    current.dropBase.push({
      tval,
      chance: asInteger(chance),
      min: asInteger(min),
      max: asInteger(max),
    })
  }

  handleFriends(key: 'friends' | 'friendsBase', value: ParserValues) {
    const current = this.current
    const [chance, count, type, role] = asTokens(value, 3, 4)

    if (role != null && role !== 'servant' && role !== 'bodyguard') {
      throw new Error('invalid friend role')
    }

    current[key] ??= []
    current[key].push({
      chance: asInteger(chance),
      count,
      type,
      role,
    })
  }

  handleMimic(values: ParserValues) {
    const current = this.current
    const [tval, sval] = asTokens(values, 2)
    // // TODO: figure out how C code handles spelling variants
    // const lookupKey = (tval.indexOf('armour'))
    //   ? tval.replace('armour', 'armor')
    //   : tval

    if (TV_NAMES[tval] == null) throw new Error('invalid object type')
    current.mimic ??= []
    current.mimic.push({
      tval,
      sval,
    })
  }

  handleShape(value: ParserValues) {
    const current = this.current
    current.shapes ??= []
    current.shapes.push(value)
  }

  handleColorCycle(value: ParserValues) {
    const current = this.current
    const [type, subtype] = asTokens(value, 2)

    current.colorCycle = { type, subtype }
  }

  private getSpellByName(name: string) {
    const spells = this.current.spells
    if (spells == null) throw new Error('no spells defined')

    for (const spell of spells) {
      if (spell.spell === name) return spell
    }

    throw new Error('no spell found with name')
  }
}
