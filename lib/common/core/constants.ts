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
    addDice: z.number().nonnegative(),
    messageName: z.string().refine(str => HIT_MESSAGES.includes(str as `HIT_${string}`))
  }))
})

export const ConstantsSchema = z.object({
  levelMax: z.object({
    monsters: z.number().positive()
  }),
  monsterGeneration: z.object({
    chance: z.number(),
    levelMin: z.number(),
    townDay: z.number(),
    townNight: z.number(),
    breederMax: z.number(),
    oodChance: z.number(),
    oodAmount: z.number(),
    groupMax: z.number(),
    groupDistance: z.number(),
  }),
  monsterGameplay: z.object({
    breakGlyph: z.number(),
    multiplicationRate: z.number(),
    lifeDrain: z.number(),
    fleeRange: z.number(),
    turnRange: z.number()
  }),
  dungeonGeneration: z.object({
    roomCenterMax: z.number(),
    doorMax: z.number(),
    wallMax: z.number(),
    tunnelMax: z.number(),
    amountRoom: z.number(),
    amountItem: z.number(),
    amountGold: z.number(),
    pitMax: z.number()
  }),
  world: z.object({
    maxDepth: z.number(),
    dayLength: z.number(),
    dungeonHeight: z.number(),
    dungeonWidth: z.number(),
    townHeight: z.number(),
    townWidth: z.number(),
    feelingTotal: z.number(),
    feelingNeed: z.number(),
    stairSkip: z.number(),
    moveEnergy: z.number()
  }),
  carryingCapacity: z.object({
    packSize: z.number(),
    quiverSize: z.number(),
    quiverSlotSize: z.number(),
    thrownQuiverMultiple: z.number(),
    floorSize: z.number()
  }),
  store: z.object({
    inventoryMax: z.number(),
    turns: z.number(),
    shuffle: z.number(),
    magicLevel: z.number()
  }),
  objectGeneration: z.object({
    maxDepth: z.number(),
    greatObject: z.number(),
    greatEgo: z.number(),
    fuelTorch: z.number(),
    fuelLamp: z.number(),
    fuelLampDefault: z.number()
  }),
  player: z.object({
    maxSight: z.number(),
    maxRange: z.number(),
    startGold: z.number(),
    foodValue: z.number()
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
