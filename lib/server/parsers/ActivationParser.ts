import { Parser } from './Parser'
import {
  asInteger,
  asTokens,
  ParserValues
} from '../../common/utilities/parsing/primitives'
import { parseEffect } from '../../common/utilities/parsing/effect'
import { parseExpression } from '../../common/utilities/parsing/expression'

import { zEffectObjectJSON } from '../../common/utilities/zod/effect'

import {
  Activation,
  ActivationJSON,
  ActivationRegistry,
} from '../../common/objects/activation'

type ActivationFields = 'name' | 'aim' | 'power' | 'effect' | 'effect-yx'
  | 'dice' | 'expr' | 'msg' | 'desc'

export class ActivationParser extends Parser<ActivationFields, ActivationJSON> {
  static readonly fileName = 'activation'
  static readonly registry = ActivationRegistry

  constructor() {
    super()

    this.register('name', this.stringRecordHeader('name'))
    this.register('aim', this.keyToBoolean('aim'))
    this.register('power', this.keyToInteger('power'))
    this.register('effect', this.handleEffect.bind(this))
    this.register('effect-yx', this.handleEffectYX.bind(this))
    this.register('dice', this.handleDice.bind(this))
    this.register('expr', this.handleExpression.bind(this))
    this.register('msg', this.keyToString('message'))
    this.register('desc', this.keyToString('description'))
  }

  _finalizeItem(obj: ActivationJSON) {
    Activation.fromJSON(obj).register()
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
}
