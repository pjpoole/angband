import { Parser } from './Parser'
import { ParserValues } from '../../common/utilities/parsing/primitives'

import { BlowEffect, BlowEffectJSON } from '../../common/monsters/blowEffect'
import { normalizeColorString } from '../../common/utilities/colors'
import {
  zBlowLoreJSON,
  zLoreColorFields
} from '../../common/utilities/zod/lore'

type BlowEffectFields = 'name' | 'power' | 'eval' | 'desc' | 'lore-color-base'
  | 'lore-color-resist' | 'lore-color-immune' | 'effect-type' | 'resist'
  | 'lash-type'

export class BlowEffectParser extends Parser<BlowEffectFields, BlowEffectJSON> {
  static readonly fileName = 'blow_effects'

  constructor() {
    super()

    this.register('name', this.stringRecordHeader('name'))
    this.register('power', this.keyToInteger('power'))
    this.register('eval', this.keyToInteger('evaluation'))
    this.register('desc', this.handleLore.bind(this))
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
    this.register('effect-type', this.keyToString('effectType'))
    // TODO: lookup parse_eff_resist; ELEM, PROJ, OF
    this.register('resist', this.keyToString('resist'))
    // TODO: default to PROJ.MISSILE
    this.register('lash-type', this.keyToString('lashType'))
  }

  _finalizeItem(obj: BlowEffectJSON) {
    BlowEffect.fromJSON(obj).register()
  }

  handleLore(values: ParserValues) {
    const current = this.current
    const lore = (current.lore?.lore ?? '') + values

    current.lore = Object.assign({}, { lore }) as zBlowLoreJSON
  }

  handleLoreColor(key: zLoreColorFields, values: ParserValues) {
    const current = this.current

    current.lore = Object.assign(
      {},
      current.lore,
      { [key]: normalizeColorString(values) },
    )
  }
}
