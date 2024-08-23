import { Parser } from './Parser'
import {
  asFlags,
  asInteger,
  asTokens,
  ParserValues
} from '../../common/utilities/parsing/primitives'
import { isInEnum } from '../../common/utilities/parsing/enums'
import { parseValuesString } from '../../common/utilities/parsing/values'

import { zObjectActivationJson } from '../../common/utilities/zod/activation'
import { ObjectFlag } from '../../common/utilities/zod/flags'
import { arrayUnion } from '../../common/utilities/array'
import { normalizeColorString } from '../../common/utilities/colors'

import { Artifact, ArtifactJSON } from '../../common/objects/artifact'

import { OF } from '../../common/objects/flags'
import { KF } from '../../common/objects/kindFlags'
import { TV_NAMES } from '../../common/objects/tval'
import { isIgnoreElem } from '../../common/spells/elements'

type ArtifactFields = 'name' | 'base-object' | 'graphics' | 'level' | 'weight'
  | 'cost' | 'alloc' | 'attack' | 'armor' | 'flags' | 'act' | 'time' | 'msg'
  | 'values' | 'brand' | 'slay' | 'curse' | 'desc'

export class ArtifactParser extends Parser<ArtifactFields, ArtifactJSON> {
  static readonly fileName = 'artifact'

  constructor() {
    super()

    this.register('name', this.stringRecordHeader('name'))
    this.register('base-object', this.handleBaseObject.bind(this))
    this.register('graphics', this.handleGraphics.bind(this))
    this.register('level', this.keyToInteger('level'))
    this.register('weight', this.keyToInteger('weight'))
    this.register('cost', this.keyToInteger('cost'))
    this.register('alloc', this.handleAllocation.bind(this))
    this.register('attack', this.handleAttack.bind(this))
    this.register('armor', this.handleArmor.bind(this))
    this.register('flags', this.handleFlags.bind(this))
    this.register('act', this.handleActivation.bind(this))
    this.register('time', this.handleTime.bind(this))
    this.register('msg', this.handleMessage.bind(this))
    this.register('values', this.handleValues.bind(this))
    this.register('brand', this.handleBrand.bind(this))
    this.register('slay', this.handleSlay.bind(this))
    this.register('curse', this.handleCurse.bind(this))
    this.register('desc', this.keyToString('description'))
  }

  _finalizeItem(obj: ArtifactJSON) {
    Artifact.fromJSON(obj).register()
  }

  handleBaseObject(values: ParserValues) {
    const current = this.current
    const [tVal, sVal] = asTokens(values, 2)
    // TODO: figure out how C code handles spelling variants
    const lookupKey = (tVal.indexOf('armour'))
      ? tVal.replace('armour', 'armor')
      : tVal

    if (TV_NAMES[lookupKey] == null) throw new Error('invalid object type')
    current.item = {
      tval: lookupKey,
      sval: sVal,
    }
  }

  handleGraphics(values: ParserValues) {
    const current = this.current
    // glyph is always one character
    current.glyph = values.charAt(0)
    // color can be a color id or a color name
    current.color = normalizeColorString(values.substring(2))
  }

  handleAttack(values: ParserValues) {
    const current = this.current
    const [baseDamage, plusToHit, plusToDamage] = asTokens(values, 3)
    current.attack = { baseDamage, plusToHit, plusToDamage }
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

    const [minLevel, maxLevel] = minToMax.split('to').map(el => el.trim()).map(
      asInteger)

    current.allocation = {
      commonness: asInteger(commonness),
      minLevel,
      maxLevel,
    }
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

  handleActivation(values: ParserValues) {
    const current = this.current
    current.activation = { activation: values }
  }

  handleTime(values: ParserValues) {
    this.getCurrentActivation().time = values
  }

  handleMessage(values: ParserValues) {
    this.getCurrentActivation().message = values
  }

  handleValues(values: ParserValues) {
    const current = this.current
    current.values = arrayUnion(current.values ?? [], parseValuesString(values))
  }

  handleSlay(values: ParserValues) {
    const current = this.current
    current.slays = arrayUnion(current.slays ?? [], [values])
  }

  handleBrand(values: ParserValues) {
    const current = this.current
    current.brands = arrayUnion(current.brands ?? [], [values])
  }

  handleCurse(values: ParserValues) {
    const current = this.current
    const [curse, power] = asTokens(values, 2)
    current.curses ??= []
    current.curses.push({ curse, power: asInteger(power) })
  }

  private getCurrentActivation(): zObjectActivationJson {
    const activation = this.current.activation
    if (activation == null) {
      throw new Error('no activation')
    }

    return activation
  }
}
