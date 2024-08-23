import { Parser } from './Parser'
import { ParserValues } from '../../common/utilities/parsing/primitives'
import { allAsEnum, asEnum } from '../../common/utilities/parsing/enums'
import { arrayUnion } from '../../common/utilities/array'
import { normalizeColorString } from '../../common/utilities/colors'
import { JsonArray } from '../../common/utilities/json'

import {
  FEAT,
  Feature,
  FeatureJSON,
  FeatureRegistry,
  TF
} from '../../common/world/features'

import { RF } from '../../common/monsters/flags'

type FeatureFields = 'code' | 'name' | 'graphics' | 'mimic'
  | 'priority' | 'flags' | 'digging' | 'desc' | 'walk-msg' | 'run-msg'
  | 'hurt-msg' | 'die-msg' | 'confused-msg' | 'look-prefix'
  | 'look-in-preposition' | 'resist-flag'

export class FeatureParser extends Parser<FeatureFields, FeatureJSON> {
  static readonly fileName = 'terrain'

  constructor() {
    super()

    this.register('code', this.handleCode.bind(this))
    this.register('name', this.keyToSingleString('name'))
    this.register('graphics', this.handleGraphics.bind(this))
    this.register('mimic', this.handleMimic.bind(this))
    this.register('priority', this.keyToInteger('priority'))
    this.register('flags', this.handleFlags.bind(this))
    this.register('digging', this.keyToInteger('digging'))
    this.register('desc', this.keyToString('description'))
    this.register('walk-msg', this.keyToString('walkMessage'))
    this.register('run-msg', this.keyToString('runMessage'))
    this.register('hurt-msg', this.keyToString('hurtMessage'))
    this.register('die-msg', this.keyToString('dieMessage'))
    this.register('confused-msg', this.keyToString('confusedMessage'))
    this.register('look-prefix', this.keyToString('lookPrefix'))
    this.register('look-in-preposition', this.keyToString('lookInPreposition'))
    this.register('resist-flag', this.handleResistFlag.bind(this))
  }

  _finalizeItem(obj: FeatureJSON) {
    Feature.fromJSON(obj).register()
  }

  toJSON(): JsonArray {
    return FeatureRegistry.toJSON()
  }

  handleCode(values: ParserValues) {
    const current = this.newCurrent()
    current.code = asEnum(values, FEAT)
  }

  handleGraphics(values: ParserValues) {
    const current = this.current
    // glyph is always one character
    current.glyph = values.charAt(0)
    // color can be a color id or a color name
    current.color = normalizeColorString(values.substring(2))
  }

  handleMimic(values: ParserValues) {
    const current = this.current
    current.mimic = asEnum(values, FEAT)
  }

  handleFlags(values: ParserValues) {
    const current = this.current
    current.flags = arrayUnion(current.flags ?? [], allAsEnum(values, TF))
  }

  handleResistFlag(values: ParserValues) {
    const current = this.current
    current.resistFlag = asEnum(values, RF)
  }
}
