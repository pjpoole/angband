import { Parser } from './Parser'
import { ParserValues } from '../../common/utilities/parsing/primitives'
import { asEnum } from '../../common/utilities/parsing/enums'
import { JsonArray } from '../../common/utilities/json'

import { Brand, BrandJSON, BrandRegistry } from '../../common/objects/brand'

import { RF } from '../../common/monsters/flags'

type BrandFields = 'code' | 'name' | 'verb' | 'multiplier' | 'o-multiplier'
  | 'power' | 'resist-flag' | 'vuln-flag'


export class BrandParser extends Parser<BrandFields, BrandJSON> {
  static readonly fileName = 'brand'

  constructor() {
    super()

    this.register('code', this.stringRecordHeader('code'))
    this.register('name', this.keyToString('name'))
    this.register('verb', this.keyToString('verb'))
    this.register('multiplier', this.keyToInteger('multiplier'))
    this.register('o-multiplier', this.keyToInteger('zeroMultiplier'))
    this.register('power', this.keyToInteger('power'))
    this.register('resist-flag', this.handleFlag.bind(this, 'resistFlag'))
    this.register('vuln-flag', this.handleFlag.bind(this, 'vulnerabilityFlag'))
  }

  _finalizeItem(obj: BrandJSON) {
    Brand.fromJSON(obj).register()
  }

  toJSON(): JsonArray {
    return BrandRegistry.toJSON()
  }

  handleFlag(key: 'resistFlag' | 'vulnerabilityFlag', values: ParserValues) {
    const current = this.current
    current[key] = asEnum(values, RF)
  }
}
