import { Parser } from './Parser'
import {
  asInteger,
  asTokens,
  ParserValues
} from '../../common/utilities/parsing/primitives'
import { parseEffect } from '../../common/utilities/parsing/effect'
import { asEnum } from '../../common/utilities/parsing/enums'
import { parseExpression } from '../../common/utilities/parsing/expression'

import { zEffectObjectJSON } from '../../common/utilities/zod/effect'
import { normalizeColorString } from '../../common/utilities/colors'
import { JsonArray } from '../../common/utilities/json'

import {
  LoreObjectJson,
  MonsterSpell,
  MonsterSpellJSON,
  MonsterSpellRegistry
} from '../../common/monsters/spells'

import { MSG } from '../../common/game/messages'

type MonsterSpellFields = 'name' | 'msgt' | 'hit' | 'effect' | 'effect-yx'
  | 'dice' | 'expr' | 'power-cutoff' | 'lore' | 'lore-color-base'
  | 'lore-color-resist' | 'lore-color-immune' | 'message-save' | 'message-vis'
  | 'message-invis' | 'message-miss'

type LoreColorFields = 'colorBase' | 'colorResist' | 'colorImmune'
type LoreMessageFields = 'messageSave' | 'messageVisible' | 'messageInvisible'
  | 'messageMiss'

export class MonsterSpellParser extends Parser<MonsterSpellFields, MonsterSpellJSON> {
  static readonly fileName = 'monster_spell'

  constructor() {
    super()

    this.register('name', this.handleName.bind(this))
    this.register('msgt', this.handleMessage.bind(this))
    this.register('hit', this.keyToInteger('hit'))
    this.register('effect', this.handleEffect.bind(this))
    this.register('effect-yx', this.handleEffectYX.bind(this))
    this.register('dice', this.handleDice.bind(this))
    this.register('expr', this.handleExpression.bind(this))
    this.register('power-cutoff', this.handlePowerCutoff.bind(this))
    this.register('lore', this.handleLore.bind(this))
    this.register(
      'lore-color-base',
      this.handleLoreColor.bind(this, 'colorBase')
    )
    this.register(
      'lore-color-resist',
      this.handleLoreColor.bind(this, 'colorResist')
    )
    this.register(
      'lore-color-immune',
      this.handleLoreColor.bind(this, 'colorImmune')
    )
    this.register(
      'message-save',
      this.handleLoreMessage.bind(this, 'messageSave')
    )
    this.register(
      'message-vis',
      this.handleLoreMessage.bind(this, 'messageVisible')
    )
    this.register(
      'message-invis',
      this.handleLoreMessage.bind(this, 'messageInvisible')
    )
    this.register(
      'message-miss',
      this.handleLoreMessage.bind(this, 'messageMiss')
    )
  }

  _finalizeItem(obj: MonsterSpellJSON) {
    MonsterSpell.fromJSON(obj).register()
  }

  toJSON(): JsonArray {
    return MonsterSpellRegistry.toJSON()
  }

  handleName(values: ParserValues) {
    const current = this.newCurrent()
    this.createNewLore()
    current.name = values
  }

  handleMessage(values: ParserValues) {
    const current = this.current
    current.messageType = asEnum(values, MSG)
  }

  handlePowerCutoff(values: ParserValues) {
    const lore = this.createNewLore()
    lore.powerCutoff = asInteger(values)
  }

  handleLore(values: ParserValues) {
    const lore = this.getCurrentLore()
    lore.lore += values
  }

  handleLoreColor(key: LoreColorFields, values: ParserValues) {
    const lore = this.getCurrentLore()
    lore[key] = normalizeColorString(values)
  }

  handleLoreMessage(key: LoreMessageFields, values: ParserValues) {
    const lore = this.getCurrentLore()
    lore[key] += values
  }

  handleEffect(values: ParserValues) {
    const current = this.current
    current.effects ??= []
    current.effects.push({
      effect: parseEffect(values)
    })
  }

  handleEffectYX(values: ParserValues) {
    const effect = this.getCurrentEffect()
    const [y, x] = asTokens(values, 2).map(asInteger)
    effect.x = x
    effect.y = y
  }

  handleDice(values: ParserValues) {
    this.getCurrentEffect().dice = values
  }

  handleExpression(values: ParserValues) {
    const effect = this.getCurrentEffect()
    effect.expression = parseExpression(values)
  }

  private getCurrentEffect(): zEffectObjectJSON {
    const effects = this.current.effects
    if (effects == null || effects.length === 0) {
      throw new Error('no current effect')
    }

    return effects[effects.length - 1]
  }

  private createNewLore(): LoreObjectJson {
    // prepopulate, and only start a new one when we hit power-cutoff
    this.current.lore ??= []
    this.current.lore.push({
      lore: '',
      messageSave: '',
      messageVisible: '',
      messageInvisible: '',
      messageMiss: '',
    } as LoreObjectJson)

    return this.getCurrentLore()
  }

  private getCurrentLore(): LoreObjectJson {
    const lore = this.current.lore
    if (lore == null || lore.length === 0) {
      throw new Error('no current lore')
    }

    return lore[lore.length - 1]
  }
}
