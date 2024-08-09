import { FEAT, FeatureParams, TF } from '../../common/world/features'
import { Parser } from './Parser'
import { allAsEnum, asEnum, ParserValues } from '../../common/utilities/parsers'
import { colorStringToAttribute } from '../../common/utilities/colors'
import { RF } from '../../common/monsters/flags'
import { FeatureRegistry } from '../../common/game/registries'

type FeatureFields = 'code' | 'name' | 'graphics' | 'mimic'
  | 'priority' | 'flags' | 'digging' | 'desc' | 'walk-msg' | 'run-msg'
  | 'hurt-msg' | 'die-msg' | 'confused-msg' | 'look-prefix'
  | 'look-in-preposition' | 'resist-flag'

export class FeatureParser extends Parser<FeatureFields, FeatureParams> {
  static readonly fileName = 'feature'
  static readonly registry = FeatureRegistry

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
    this.register('resist-flag', this.handleResists.bind(this))
  }

  finalize() {
    for (const obj of this.objects) {
      FeatureRegistry.build(FEAT[obj.code], obj)
    }
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
    current.color = colorStringToAttribute(values.substring(2))
  }

  handleMimic(values: ParserValues) {
    const current = this.current
    current.mimic = asEnum(values, FEAT)
  }

  handleFlags(values: ParserValues) {
    const current = this.current
    current.flags = allAsEnum(values, TF)
  }

  handleResists(values: ParserValues) {
    const current = this.current
    current.resistFlag = asEnum(values, RF)
  }
}
