import { Parser } from './Parser'
import {
  asInteger,
  ParserValues
} from '../../common/utilities/parsing/primitives'
import { parseCombat } from '../../common/utilities/parsing/combat'
import { parseEffect } from '../../common/utilities/parsing/effect'
import { allAsEnum } from '../../common/utilities/parsing/enums'
import { parseExpression } from '../../common/utilities/parsing/expression'
import { parseValuesString } from '../../common/utilities/parsing/values'

import { arrayUnion } from '../../common/utilities/array'

import { Shape, ShapeEffectsJSON, ShapeJSON, ShapeRegistry } from '../../common/player/shape'

import { OF } from '../../common/objects/flags'
import { PF } from '../../common/player/flags'
import { SkillFields, skillNameToKey } from '../../common/player/skill'

type ShapeFields = 'name' | 'combat' | 'skill-disarm-phys'
  | 'skill-disarm-magic' | 'skill-save' | 'skill-stealth' | 'skill-search'
  | 'skill-melee' | 'skill-throw' | 'skill-dig' | 'obj-flags' | 'player-flags'
  | 'values' | 'effect' | 'dice' | 'expr' | 'effect-msg' | 'blow'

export class ShapeParser extends Parser<ShapeFields, ShapeJSON> {
  static readonly fileName = 'shape'
  static readonly registry = ShapeRegistry

  constructor() {
    super()

    this.register('name', this.stringRecordHeader('name'))
    this.register('combat', this.handleCombat.bind(this))
    this.register('skill-disarm-phys', this.handleSkill.bind(this, 'skill-disarm-phys'))
    this.register('skill-disarm-magic', this.handleSkill.bind(this, 'skill-disarm-magic'))
    this.register('skill-save', this.handleSkill.bind(this, 'skill-save'))
    this.register('skill-stealth', this.handleSkill.bind(this, 'skill-stealth'))
    this.register('skill-search', this.handleSkill.bind(this, 'skill-search'))
    this.register('skill-melee', this.handleSkill.bind(this, 'skill-melee'))
    this.register('skill-throw', this.handleSkill.bind(this, 'skill-throw'))
    this.register('skill-dig', this.handleSkill.bind(this, 'skill-dig'))
    this.register('obj-flags', this.handleObjectFlags.bind(this))
    this.register('player-flags', this.handlePlayerFlags.bind(this))
    this.register('values', this.handleValues.bind(this))
    this.register('effect', this.handleEffect.bind(this))
    this.register('dice', this.handleDice.bind(this))
    this.register('expr', this.handleExpression.bind(this))
    this.register('effect-msg', this.keyToString('effectMessage'))
    this.register('blow', this.handleBlow.bind(this))
  }

  _finalize(obj: ShapeJSON) {
    Shape.fromJSON(obj).register()
  }

  handleSkill(key: ShapeFields & SkillFields, values: ParserValues) {
    const current = this.current
    current.skill ??= {}
    current.skill[skillNameToKey(key)] = asInteger(values)
  }

  handleCombat(values: ParserValues) {
    const current = this.current
    current.combat = parseCombat(values)
  }

  handleObjectFlags(values: ParserValues) {
    const current = this.current
    current.objectFlags = arrayUnion(
      current.objectFlags ?? [],
      allAsEnum(values, OF)
    )
  }

  handlePlayerFlags(values: ParserValues) {
    const current = this.current
    current.playerFlags = arrayUnion(
      current.playerFlags ?? [],
      allAsEnum(values, PF)
    )
  }

  handleValues(values: ParserValues) {
    const current = this.current
    current.values = arrayUnion(current.values ?? [], parseValuesString(values))
  }

  handleEffect(values: ParserValues) {
    const current = this.current
    current.effects ??= []
    current.effects.push({ effect: parseEffect(values) })
  }

  handleDice(values: ParserValues) {
    const openEffect = this.getCurrentEffect()

    if (openEffect.dice != null) {
      throw new Error('trying to define multiple dice on effect')
    }

    openEffect.dice = values
  }

  handleExpression(values: ParserValues) {
    const openEffect = this.getCurrentEffect()

    if (openEffect.expression != null) {
      throw new Error('trying to define multiple expressions on effect')
    }

    openEffect.expression = parseExpression(values)
  }

  handleBlow(values: ParserValues) {
    const current = this.current
    current.blow = arrayUnion(current.blow ?? [], [values])
  }

  private getCurrentEffect(): ShapeEffectsJSON {
    const effects = this.current.effects

    if (effects == null || effects.length === 0) {
      throw new Error('no current effect')
    }

    return effects[effects.length - 1]
  }
}
