import { Parser } from './Parser'
import {
  asFlags,
  asInteger,
  asTokens,
  ParserValues
} from '../../common/utilities/parsing/primitives'
import {
  parseCombat,
  parseCombatMin
} from '../../common/utilities/parsing/combat'
import { isInEnum } from '../../common/utilities/parsing/enums'
import { parseValuesString } from '../../common/utilities/parsing/values'

import { arrayUnion } from '../../common/utilities/array'
import { zObjectActivationJson } from '../../common/utilities/zod/activation'
import { ObjectFlag } from '../../common/utilities/zod/flags'

import { EgoItem, EgoItemJSON } from '../../common/objects/egoItem'

import { OF } from '../../common/objects/flags'
import { KF } from '../../common/objects/kindFlags'
import { TV_NAMES } from '../../common/objects/tval'
import { isIgnoreElem } from '../../common/spells/elements'

type EgoItemFields = 'name' | 'info' | 'alloc' | 'combat' | 'min-combat'
  | 'type' | 'item' | 'flags' | 'flags-off' | 'values' | 'min-values' | 'act'
  | 'time' | 'brand' | 'slay' | 'curse' | 'desc'

export class EgoItemParser extends Parser<EgoItemFields, EgoItemJSON> {
  static readonly fileName = 'ego_item'

  constructor() {
    super()

    this.register('name', this.stringRecordHeader('name'))
    this.register('info', this.handleInfo.bind(this))
    this.register('alloc', this.handleAllocation.bind(this))
    this.register('combat', this.handleCombat.bind(this))
    this.register('min-combat', this.handleCombatMin.bind(this))
    this.register('type', this.handleType.bind(this))
    this.register('item', this.handleItem.bind(this))
    this.register('flags', this.handleFlags.bind(this, 'flags'))
    this.register('flags-off', this.handleFlags.bind(this, 'flagsOff'))
    this.register('values', this.handleValues.bind(this))
    this.register('min-values', this.handleValuesMin.bind(this))
    this.register('act', this.handleActivation.bind(this))
    this.register('time', this.handleTime.bind(this))
    this.register('brand', this.handleBrand.bind(this))
    this.register('slay', this.handleSlay.bind(this))
    this.register('curse', this.handleCurse.bind(this))
    this.register('desc', this.keyToString('description'))
  }

  _finalizeItem(obj: EgoItemJSON) {
    EgoItem.fromJSON(obj).register()
  }

  handleInfo(values: ParserValues) {
    const current = this.current
    const [cost, rating] = asTokens(values, 2).map(asInteger)
    current.cost = cost
    current.rating = rating
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

  handleCombat(values: ParserValues) {
    const current = this.current
    current.combat = parseCombat(values)
  }

  handleCombatMin(values: ParserValues) {
    const current = this.current
    current.combatMin = parseCombatMin(values)
  }

  handleType(values: ParserValues) {
    const current = this.current
    if (TV_NAMES[values] == null) throw new Error('invalid object type')
    current.types = arrayUnion(current.types ?? [], [values])
  }

  handleItem(values: ParserValues) {
    const current = this.current
    const [tVal, sVal] = asTokens(values, 2)
    // TODO: figure out how C code handles spelling variants
    const lookupKey = (tVal.indexOf('armour'))
      ? tVal.replace('armour', 'armor')
      : tVal

    if (TV_NAMES[lookupKey] == null) throw new Error('invalid object type')
    current.items ??= []
    current.items.push({
      tval: lookupKey,
      sval: sVal,
    })
  }

  handleFlags(key: 'flags' | 'flagsOff', values: ParserValues) {
    const current = this.current
    const flags = asFlags(values)

    const results: ObjectFlag[] = []
    for (const flag of flags) {
      if (!isInEnum(flag, OF) && !isInEnum(flag, KF) && !isIgnoreElem(flag)) {
        throw new Error('invalid object flag')
      }

      results.push(flag)
    }

    current[key] = arrayUnion(current[key] ?? [], results)
  }

  handleValues(values: ParserValues) {
    const current = this.current
    current.values = arrayUnion(current.values ?? [], parseValuesString(values))
  }

  handleValuesMin(values: ParserValues) {
    const current = this.current
    current.valuesMin = arrayUnion(current.valuesMin ?? [], parseValuesString(values))
  }

  handleActivation(values: ParserValues) {
    const current = this.current
    current.activation = { activation: values }
  }

  handleTime(values: ParserValues) {
    this.getCurrentActivation().time = values
  }

  handleBrand(values: ParserValues) {
    const current = this.current
    current.brands = arrayUnion(current.brands ?? [], [values])
  }

  handleSlay(values: ParserValues) {
    const current = this.current
    current.slays = arrayUnion(current.slays ?? [], [values])
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
