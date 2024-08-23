import { Parser } from './Parser'
import {
  asFlags,
  asInteger,
  asTokens,
  ParserValues
} from '../../common/utilities/parsing/primitives'
import { parseEffect } from '../../common/utilities/parsing/effect'
import { isInEnum } from '../../common/utilities/parsing/enums'
import { parseExpression } from '../../common/utilities/parsing/expression'
import { parseValuesString } from '../../common/utilities/parsing/values'

import { arrayUnion } from '../../common/utilities/array'
import { normalizeColorString } from '../../common/utilities/colors'
import { zEffectObjectJSON } from '../../common/utilities/zod/effect'
import { ObjectFlag } from '../../common/utilities/zod/flags'

import { AngbandObject, AngbandObjectJSON, } from '../../common/objects/object'

import { OF } from '../../common/objects/flags'
import { KF } from '../../common/objects/kindFlags'
import { TV_NAMES } from '../../common/objects/tval'
import { isIgnoreElem } from '../../common/spells/elements'

type ObjectFields = 'name' | 'graphics' | 'type' | 'level' | 'weight' | 'cost'
  | 'attack' | 'armor' | 'alloc' | 'charges' | 'pile' | 'power' | 'msg'
  | 'vis-msg' | 'effect' | 'effect-yx' | 'dice' | 'expr' | 'flags' | 'values'
  | 'slay' | 'curse' | 'time' | 'pval' | 'desc'

export class ObjectParser extends Parser<ObjectFields, AngbandObjectJSON> {
  static readonly fileName = 'object'

  constructor() {
    super()

    this.register('name', this.stringRecordHeader('name'))
    this.register('graphics', this.handleGraphics.bind(this))
    this.register('type', this.handleType.bind(this))
    this.register('level', this.keyToInteger('level'))
    this.register('weight', this.keyToInteger('weight'))
    this.register('cost', this.keyToInteger('cost'))
    this.register('attack', this.handleAttack.bind(this))
    this.register('armor', this.handleArmor.bind(this))
    this.register('alloc', this.handleAllocation.bind(this))
    this.register('charges', this.keyToString('charges'))
    this.register('pile', this.handlePile.bind(this))
    this.register('power', this.keyToInteger('power'))
    this.register('msg', this.keyToString('message'))
    this.register('vis-msg', this.keyToString('messageVisible'))
    this.register('effect', this.handleEffect.bind(this))
    this.register('effect-yx', this.handleEffectYX.bind(this))
    this.register('dice', this.handleDice.bind(this))
    this.register('expr', this.handleExpression.bind(this))
    this.register('flags', this.handleFlags.bind(this))
    this.register('values', this.handleValues.bind(this))
    this.register('slay', this.handleSlay.bind(this))
    this.register('curse', this.handleCurse.bind(this))
    this.register('time', this.keyToString('time'))
    this.register('pval', this.keyToInteger('pval'))
    this.register('desc', this.keyToString('description'))
  }

  _finalizeItem(obj: AngbandObjectJSON) {
    AngbandObject.fromJSON(obj).register()
  }

  handleGraphics(values: ParserValues) {
    const current = this.current
    // glyph is always one character
    current.glyph = values.charAt(0)
    // color can be a color id or a color name
    current.color = normalizeColorString(values.substring(2))
  }

  handleType(values: ParserValues) {
    const current = this.current
    if (TV_NAMES[values] == null) throw new Error('invalid object type')
    current.type = values
  }

  handleAttack(values: ParserValues) {
    const current = this.current
    const [baseDamage, plusToHit, plusToDamage] = asTokens(values, 3)
    current.attack = { baseDamage, plusToHit, plusToDamage, }
  }

  handleArmor(values: ParserValues) {
    const current = this.current
    const [baseAC, plusToAC] = asTokens(values, 2)
    current.armor = {
      baseAC: asInteger(baseAC),
      plusToAC,
    }
  }

  handleAllocation(values: ParserValues) {
    const current = this.current
    const [commonness, minToMax] = asTokens(values, 2)

    const [minLevel, maxLevel] = minToMax.split('to').map(el => el.trim()).map(asInteger)

    current.allocation = {
      commonness: asInteger(commonness),
      minLevel,
      maxLevel,
    }
  }

  handlePile(values: ParserValues) {
    const current = this.current
    const [chance, number] = asTokens(values, 2)
    current.pile = {
      chance: asInteger(chance),
      number,
    }
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

  handleFlags(values: ParserValues) {
    const current = this.current
    const flags = asFlags(values)

    const results: ObjectFlag[] = []
    for (const flag of flags) {
      if (!isInEnum(flag, OF) && !isInEnum(flag, KF) && !isIgnoreElem(flag)) {
        throw new Error('invalid object flag')
      }

      results.push(flag)
    }

    current.flags = arrayUnion(current.flags ?? [], results)
  }

  handleValues(values: ParserValues) {
    const current = this.current
    current.values = arrayUnion(current.values ?? [], parseValuesString(values))
  }

  handleSlay(values: ParserValues) {
    const current = this.current
    current.slay = arrayUnion(current.slay ?? [], [values])
  }

  handleCurse(values: ParserValues) {
    const current = this.current
    const [curse, power] = asTokens(values, 2)
    current.curses ??= []
    current.curses.push({ curse, power: asInteger(power) })
  }

  private getCurrentEffect(): zEffectObjectJSON {
    const effects = this.current.effects
    if (effects == null || effects.length === 0) {
      throw new Error('no current effect')
    }

    return effects[effects.length - 1]
  }
}
