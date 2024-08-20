import { Parser } from './Parser'
import { Curse, CurseFlag, CurseJSON } from '../../common/objects/curse'
import { CurseRegistry } from '../../common/game/registries'
import {
  allAsEnum,
  asEnum,
  asFlags,
  asInteger,
  asTokens,
  ParserValues
} from '../../common/utilities/parsers'
import { arrayUnion } from '../../common/utilities/array'

import { OF } from '../../common/objects/flags'
import { TV } from '../../common/objects/tval'
import { EF } from '../../common/spells/effects'
import { EX } from '../../common/spells/expressions'
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
    this.register('conflict', this.handleConflict.bind('this'))
    this.register('conflict-flags', this.handleConflictFlags.bind(this))
  }

  _finalize(obj: CurseJSON) {
    const curse = Curse.fromJSON(obj)
    CurseRegistry.add(curse.name, curse)
  }

  handleType(values: ParserValues) {
    const current = this.current
    const type = asEnum(values, TV)
    current.types = arrayUnion(current.types ?? [], [type])
  }

  handleCombat(values: ParserValues) {
    const current = this.current
    const [toHit, toDamage, toAC] = asTokens(values, 3).map(asInteger)
    current.combat = { toHit, toDamage, toAC }
  }

  handleEffect(values: ParserValues) {
    const current = this.current
    current.effect = arrayUnion(current.effect ?? [], allAsEnum(values, EF))
  }

  handleExpression(values: ParserValues) {
    const current = this.current
    const [variable, type, expression] = asTokens(values, 3)
    current.expression = { variable, type: asEnum(type, EX), expression }
  }

  handleFlags(values: ParserValues) {
    const current = this.current
    const flags = asFlags(values)

    const results: CurseFlag[] = []
    for (const flag of flags) {
      let mapped = OF[flag]
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
    current.values = arrayUnion(current.values ?? [], asFlags(values))
  }

  handleConflict(values: ParserValues) {
    const current = this.current
    current.conflicts = arrayUnion(current.conflicts ?? [], [values])
  }

  handleConflictFlags(values: ParserValues) {
    const current = this.current
    current.conflictFlags = arrayUnion(current.conflictFlags ?? [], allAsEnum(values, OF))
  }
}
