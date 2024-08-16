import { z } from 'zod'
import { HIT_MESSAGES } from '../game/messages'
import { SerializableBase } from './serializable'

const criticalConstants = z.object({
  debuffToHit: z.number(),
  chanceWeightScale: z.number(),
  chanceToHitScale: z.number(),
  chanceLevelScale: z.number(),
  chanceToHitSkillScale: z.number(),
  chanceOffset: z.number(),
  chanceRange: z.number(),
  powerWeightScale: z.number(),
  powerRandom: z.number(),
  level: z.array(z.object({
    powerCutoff: z.number(),
    damageMultiplier: z.number(),
    damageAdded: z.number(),
    messageName: z.string().refine(str => HIT_MESSAGES.includes(str as `HIT_${string}`))
  }))
})

const zeroCriticalConstants = z.object({
  debuffToHit: z.number(),
  powerToHitScaleNumerator: z.number(),
  powerToHitScaleDenominator: z.number(),
  chancePowerScaleNumerator: z.number(),
  chancePowerScaleDenominator: z.number(),
  chanceAddDenominator: z.number(),
  level: z.array(z.object({
    powerCutoff: z.number().positive(),
    addedDice: z.number().nonnegative(),
    messageName: z.string().refine(str => HIT_MESSAGES.includes(str as `HIT_${string}`))
  }))
})

export const ConstantsSchema = z.object({
  levelMax: z.object({
    monsters: z.number().nonnegative()
  }),
  monsterGeneration: z.object({
    chance: z.number().nonnegative(),
    levelMin: z.number().nonnegative(),
    townDay: z.number().nonnegative(),
    townNight: z.number().nonnegative(),
    breederMax: z.number().nonnegative(),
    oodChance: z.number().nonnegative(),
    oodAmount: z.number().nonnegative(),
    groupMax: z.number().nonnegative(),
    groupDistance: z.number().nonnegative(),
  }),
  monsterGameplay: z.object({
    breakGlyph: z.number().nonnegative(),
    multiplicationRate: z.number().nonnegative(),
    lifeDrain: z.number().nonnegative(),
    fleeRange: z.number().nonnegative(),
    turnRange: z.number().nonnegative(),
  }),
  dungeonGeneration: z.object({
    roomCenterMax: z.number().nonnegative(),
    doorMax: z.number().nonnegative(),
    wallMax: z.number().nonnegative(),
    tunnelMax: z.number().nonnegative(),
    amountRoom: z.number().nonnegative(),
    amountItem: z.number().nonnegative(),
    amountGold: z.number().nonnegative(),
    pitMax: z.number().nonnegative(),
  }),
  world: z.object({
    maxDepth: z.number().nonnegative(),
    dayLength: z.number().nonnegative(),
    dungeonHeight: z.number().nonnegative(),
    dungeonWidth: z.number().nonnegative(),
    townHeight: z.number().nonnegative(),
    townWidth: z.number().nonnegative(),
    feelingTotal: z.number().nonnegative(),
    feelingNeed: z.number().nonnegative(),
    stairSkip: z.number().nonnegative(),
    moveEnergy: z.number().nonnegative(),
  }),
  carryingCapacity: z.object({
    packSize: z.number().nonnegative(),
    quiverSize: z.number().nonnegative(),
    quiverSlotSize: z.number().nonnegative(),
    thrownQuiverMultiple: z.number().nonnegative(),
    floorSize: z.number().nonnegative(),
  }),
  store: z.object({
    inventoryMax: z.number().nonnegative(),
    turns: z.number().nonnegative(),
    shuffle: z.number().nonnegative(),
    magicLevel: z.number().nonnegative(),
  }),
  objectGeneration: z.object({
    maxDepth: z.number().nonnegative(),
    greatObject: z.number().nonnegative(),
    greatEgo: z.number().nonnegative(),
    fuelTorch: z.number().nonnegative(),
    fuelLamp: z.number().nonnegative(),
    fuelLampDefault: z.number().nonnegative(),
  }),
  player: z.object({
    maxSight: z.number().nonnegative(),
    maxRange: z.number().nonnegative(),
    startGold: z.number().nonnegative(),
    foodValue: z.number().nonnegative(),
  }),
  meleeCritical: criticalConstants,
  launchedCritical: criticalConstants,
  thrownCritical: z.object({
    chanceToHitSkillScale: z.number(),
  }),
  zeroCritical: zeroCriticalConstants,
  zeroLaunchedCritical: zeroCriticalConstants,
  zeroThrownCritical: z.object({
    powerToHitScaleNumerator: z.number(),
    powerToHitScaleDenominator: z.number(),
  })
}).strict()

export type ConstantsJSON = z.input<typeof ConstantsSchema>
export type ConstantsParams = z.output<typeof ConstantsSchema>

export class Constants extends SerializableBase {
  static schema = ConstantsSchema

  readonly data: ConstantsParams

  constructor(params: ConstantsParams) {
    super(params)

    this.data = params
  }

  toJSON(): ConstantsJSON {
    console.log('called')
    return this.data
  }
}
