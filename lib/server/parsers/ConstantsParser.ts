import { Constants, ConstantsJSON } from '../../common/core/constants'

import { Parser } from './Parser'
import {
  asInteger,
  asTokens,
  ParserValues
} from '../../common/utilities/parsers'
import { kebabToPascal } from '../../common/utilities/string'
import { JsonObject } from '../../common/utilities/json'
import { writeGameData } from '../loading/writing'

type ConstantsFields = 'level-max' | 'mon-gen' | 'mon-play' | 'dun-gen'
  | 'world' | 'carry-cap' | 'store' | 'obj-make' | 'player' | 'melee-critical'
  | 'melee-critical-level' | 'ranged-critical' | 'ranged-critical-level'
  | 'o-melee-critical' | 'o-melee-critical-level' | 'o-ranged-critical'
  | 'o-ranged-critical-level'

interface ConstantsJSONOverride {
  [key: string]: InternalJson
}

interface InternalJson {
  [key: string]: number | (CriticalLevel | ZeroCriticalLevel)[]
}

type Remapper<T extends keyof ConstantsJSON> = {
  [key: string]: keyof ConstantsJSON[T]
}

const DefaultMap: Remapper<keyof ConstantsJSON> = {}
const MonsterGenerationMap: Remapper<'monsterGeneration'> = {
  'repro-max': 'breederMax',
  'group-dist': 'groupDistance'
}
const MonsterGameplayMap: Remapper<'monsterGameplay'> = {
  'mult-rate': 'multiplicationRate'
}
const DungeonGenerationMap: Remapper<'dungeonGeneration'> = {
  'cent-max': 'roomCenterMax',
  'tunn-max': 'tunnelMax',
  'amt-room': 'amountRoom',
  'amt-item': 'amountItem',
  'amt-gold': 'amountGold'
}
const WorldMap: Remapper<'world'> = {
  'dungeon-hgt': 'dungeonHeight',
  'dungeon-wid': 'dungeonWidth',
  'town-hgt': 'townHeight',
  'town-wid': 'townWidth'
}
const CarryingCapacityMap: Remapper<'carryingCapacity'> = {
  'thrown-quiver-mult': 'thrownQuiverMultiple'
}
const StoreMap: Remapper<'store'> = {
  'inven-max': 'inventoryMax'
}
const ObjectGenerationMap: Remapper<'objectGeneration'> = {
  'great-obj': 'greatObject',
  'default-lamp': 'fuelLampDefault'
}
const CriticalMap: Remapper<'meleeCritical'> = {
  'debuff-toh': 'debuffToHit',
  'chance-toh-scale': 'chanceToHitScale',
  'chance-toh-skill-scale': 'chanceToHitSkillScale',
  'chance-launched-toh-skill-scale': 'chanceToHitSkillScale',
  'chance-thrown-toh-skill-scale': 'chanceToHitSkillScale'
}
const ZeroCriticalMap: Remapper<'zeroCritical'> = {
  'debuff-toh': 'debuffToHit',
  'power-toh-scale-numerator': 'powerToHitScaleNumerator',
  'power-toh-scale-denominator': 'powerToHitScaleDenominator',
  'power-launched-toh-scale-numerator': 'powerToHitScaleNumerator',
  'power-launched-toh-scale-denominator': 'powerToHitScaleDenominator',
  'power-thrown-toh-scale-numerator': 'powerToHitScaleNumerator',
  'power-thrown-toh-scale-denominator': 'powerToHitScaleDenominator',
}

interface CriticalLevel {
  powerCutoff: number
  damageMultiplier: number
  damageAdded: number
  messageName: string
}

interface ZeroCriticalLevel {
  powerCutoff: number
  addedDice: number
  messageName: string
}

export class ConstantsParser extends Parser<ConstantsFields, ConstantsJSONOverride> {
  static readonly fileName = 'constants'

  constructor() {
    super()

    this.register('level-max', this.handleRemapper.bind(this, 'levelMax', DefaultMap))
    this.register('mon-gen', this.handleRemapper.bind(this, 'monsterGeneration', MonsterGenerationMap))
    this.register('mon-play', this.handleRemapper.bind(this, 'monsterGameplay', MonsterGameplayMap))
    this.register('dun-gen', this.handleRemapper.bind(this, 'dungeonGeneration', DungeonGenerationMap))
    this.register('world', this.handleRemapper.bind(this, 'world', WorldMap))
    this.register('carry-cap', this.handleRemapper.bind(this, 'carryingCapacity', CarryingCapacityMap))
    this.register('store', this.handleRemapper.bind(this, 'store', StoreMap))
    this.register('obj-make', this.handleRemapper.bind(this, 'objectGeneration', ObjectGenerationMap))
    this.register('player', this.handleRemapper.bind(this, 'player', DefaultMap))
    this.register('melee-critical', this.handleRemapper.bind(this, 'meleeCritical', CriticalMap))
    this.register('melee-critical-level', this.handleMeleeCriticalLevel.bind(this))
    this.register('ranged-critical', this.handleRangedCritical.bind(this))
    this.register('ranged-critical-level', this.handleRangedCriticalLevel.bind(this))
    this.register('o-melee-critical', this.handleRemapper.bind(this, 'zeroCritical', ZeroCriticalMap))
    this.register('o-melee-critical-level', this.handleZeroCriticalLevel.bind(this))
    this.register('o-ranged-critical', this.handleZeroRangedCritical.bind(this))
    this.register('o-ranged-critical-level', this.handleZeroRangedCriticalLevel.bind(this))

    // singleton object
    this.newCurrent()
  }

  // we handle our own serialization because we're a singleton
  override async finalize() {
    this.finalizeCurrent()

    let seenOne = false
    for (const obj of this.objects) {
      if (seenOne) throw new Error('multiple constants specified')
      seenOne = true

      const constants = Constants.fromJSON(obj as JsonObject)
      await writeGameData(ConstantsParser.fileName, constants.toJSON())
    }
  }

  // Stub for class; TODO: is this necessary?
  _finalize(obj: ConstantsJSONOverride) {}

  handleRemapper(jsonKey: keyof ConstantsJSON, remapper: Record<string, string>, values: ParserValues) {
    const current = this.current

    const [key, value] = asTokens(values, 2)

    const remapped = remapper[key] ?? kebabToPascal(key)

    current[jsonKey] ??= {}
    current[jsonKey][remapped] = asInteger(value)
  }

  handleMeleeCriticalLevel(values: ParserValues) {
    const current = this.current

    const [powerCutoff, damageMultiplier, damageAdded, messageName] = asTokens(values, 4)

    const level = {
      powerCutoff: asInteger(powerCutoff),
      damageMultiplier: asInteger(damageMultiplier),
      damageAdded: asInteger(damageAdded),
      messageName
    }

    current.meleeCritical ??= {}
    let levels = current.meleeCritical.level
    if (!Array.isArray(levels)) {
      levels = [level]
    } else {
      levels.push(level)
    }

    current.meleeCritical.level = levels
  }

  handleRangedCritical(values: ParserValues) {
    let key: 'launchedCritical' | 'thrownCritical' = 'launchedCritical'
    let [subKey, ...rest] = values.split(':')

    if (subKey === 'chance-launched-toh-skill-scale') {
      subKey = 'chance-toh-skill-scale'
    } else if (subKey === 'chance-thrown-toh-skill-scale') {
      key = 'thrownCritical'
      subKey = 'chance-toh-skill-scale'
    }

    this.handleRemapper(key, CriticalMap, [subKey, ...rest].join(':'))
  }

  handleRangedCriticalLevel(values: ParserValues) {
    const current = this.current

    const level = this.parseCriticalLevel(values)

    current.launchedCritical ??= {}
    this.appendCriticalLevel(current.launchedCritical, level)
  }

  handleZeroCriticalLevel(values: ParserValues) {
    const current = this.current

    const level = this.parseZeroCriticalLevel(values)

    current.zeroCritical ??= {}
    this.appendCriticalLevel(current.zeroCritical, level)
  }

  handleZeroRangedCritical(values: ParserValues) {
    let key: 'zeroLaunchedCritical' | 'zeroThrownCritical' = 'zeroLaunchedCritical'
    let [subKey, ...rest] = values.split(':')

    if (subKey.startsWith('power-launched-')) {
      subKey.replace('-launched', '')
    } else if (subKey.startsWith('power-thrown-')) {
      key = 'zeroThrownCritical'
      subKey.replace('-thrown', '')
    }

    this.handleRemapper(key, ZeroCriticalMap, [subKey, ...rest].join(':'))
  }

  handleZeroRangedCriticalLevel(values: ParserValues) {
    const current = this.current

    const level = this.parseZeroCriticalLevel(values)

    current.zeroLaunchedCritical ??= {}
    this.appendCriticalLevel(current.zeroLaunchedCritical, level)
  }

  private parseCriticalLevel(values: ParserValues): CriticalLevel {
    const [powerCutoff, damageMultiplier, damageAdded, messageName] = asTokens(values, 4)

    return {
      powerCutoff: asInteger(powerCutoff),
      damageMultiplier: asInteger(damageMultiplier),
      damageAdded: asInteger(damageAdded),
      messageName
    }
  }

  private parseZeroCriticalLevel(values: ParserValues): ZeroCriticalLevel {
    const [powerCutoff, addedDice, messageName] = asTokens(values, 3)

    return {
      powerCutoff: asInteger(powerCutoff),
      addedDice: asInteger(addedDice),
      messageName
    }
  }

  private appendCriticalLevel(obj: InternalJson, level: CriticalLevel | ZeroCriticalLevel): void {
    let levels = obj.level
    if (!Array.isArray(levels)) {
      levels = [level]
    } else {
      levels.push(level)
    }

    obj.level = levels
  }
}
