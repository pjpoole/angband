import { Parser } from './Parser'

import {
  asFlags,
  ParserValues
} from '../../common/utilities/parsing/primitives'
import { parseCombat } from '../../common/utilities/parsing/combat'
import { parseEffects } from '../../common/utilities/parsing/effect'
import { allAsEnum, maybeAsEnum } from '../../common/utilities/parsing/enums'
import { parseExpression } from '../../common/utilities/parsing/expression'
import { parseValuesString } from '../../common/utilities/parsing/values'

import { arrayUnion } from '../../common/utilities/array'
import { CurseFlag } from '../../common/utilities/zod/flags'

import { Curse, CurseJSON, CurseRegistry } from '../../common/objects/curse'

import { OF } from '../../common/objects/flags'
import { TV_NAMES } from '../../common/objects/tval'
import { isHatesElem, isIgnoreElem } from '../../common/spells/elements'

type CurseFields = 'name' | 'type' | 'weight' | 'combat' | 'effect' | 'dice'
  | 'expr' | 'time' | 'flags' | 'values' | 'msg' | 'desc' | 'conflict'
  | 'conflict-flags'

export class CurseParser extends Parser<CurseFields, CurseJSON> {
  static readonly fileName = 'curse'
  static readonly registry = CurseRegistry

  constructor() {
    super()

    this.register('name', this.stringRecordHeader('name'))
    this.register('type', this.handleType.bind(this))
    this.register('weight', this.keyToInteger('weight'))
    this.register('combat', this.handleCombat.bind(this))
    this.register('effect', this.handleEffect.bind(this))
    this.register('dice', this.keyToString('dice'))
    this.register('expr', this.handleExpression.bind(this))
    this.register('time', this.keyToString('time'))
    this.register('flags', this.handleFlags.bind(this))
    this.register('values', this.handleValues.bind(this))
    this.register('msg', this.keyToString('message'))
    this.register('desc', this.keyToString('description'))
    this.register('conflict', this.handleConflicts.bind(this))
    this.register('conflict-flags', this.handleConflictFlags.bind(this))
  }

  _finalizeItem(obj: CurseJSON) {
    Curse.fromJSON(obj).register()
  }

  handleType(values: ParserValues) {
    const current = this.current
    if (TV_NAMES[values] == null) throw new Error('invalid object type')
    current.types = arrayUnion(current.types ?? [], [values])
  }

  handleCombat(values: ParserValues) {
    const current = this.current
    current.combat = parseCombat(values)
  }

  handleEffect(values: ParserValues) {
    const current = this.current
    current.effect = parseEffects(values, current.effect)
  }

  handleExpression(values: ParserValues) {
    const current = this.current
    current.expression = parseExpression(values)
  }

  handleFlags(values: ParserValues) {
    const current = this.current
    const flags = asFlags(values)

    const results: CurseFlag[] = []
    for (const flag of flags) {
      let mapped = maybeAsEnum(flag, OF)
      if (mapped) {
        results.push(mapped)
      } else {
        if (isHatesElem(flag)) {
          results.push(flag)
        } else if (isIgnoreElem(flag)) {
          results.push(flag)
        } else {
          throw new Error('invalid curse flag')
        }
      }
    }

    current.flags = arrayUnion(current.flags ?? [], results)
  }

  handleValues(values: ParserValues) {
    const current = this.current
    current.values = arrayUnion(current.values ?? [], parseValuesString(values))
  }

  handleConflicts(values: ParserValues) {
    const current = this.current
    current.conflicts = arrayUnion(current.conflicts ?? [], [values])
  }

  handleConflictFlags(values: ParserValues) {
    const current = this.current
    current.conflictFlags = arrayUnion(current.conflictFlags ?? [], allAsEnum(values, OF))
  }
}
