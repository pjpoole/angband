import { z } from 'zod'
import { MON_MESSAGES, MSG } from '../game/messages'
import { SerializableBase } from '../core/serializable'
import { enumValueToKeyOrThrow } from '../utilities/enum'

// mon-blows.c, effect_handlers
// Blow effects
export enum BLOW_EF {
  NONE,
  HURT,
  POISON,
  DISENCHANT,
  DRAIN_CHARGES,
  EAT_GOLD,
  EAT_ITEM,
  EAT_FOOD,
  EAT_LIGHT,
  ACID,
  ELEC,
  FIRE,
  COLD,
  BLIND,
  CONFUSE,
  TERRIFY,
  PARALYZE,
  LOSE_STR,
  LOSE_INT,
  LOSE_WIS,
  LOSE_DEX,
  LOSE_CON,
  LOSE_ALL,
  SHATTER,
  EXP_10,
  EXP_20,
  EXP_40,
  EXP_80,
  HALLU,
  BLACK_BREATH,
}

export const BlowSchema = z.object({
  name: z.string(),
  cut: z.boolean(),
  stun: z.boolean(),
  miss: z.boolean(),
  physical: z.boolean(),
  message: z.string().refine(str => MON_MESSAGES.includes(str as `MON_${string}`)),
  actions: z.array(z.string()),
  description: z.string(),
})

export type BlowJSON = z.input<typeof BlowSchema>
export type BlowParams = z.output<typeof BlowSchema>

export class Blow extends SerializableBase {
  static schema = BlowSchema

  readonly name: string
  readonly cut: boolean
  readonly stun: boolean
  readonly miss: boolean
  readonly physical: boolean
  readonly message: MSG
  readonly actions: string[]
  readonly description: string

  constructor(params: BlowParams) {
    super(params)

    this.name = params.name
    this.cut = params.cut
    this.stun = params.stun
    this.miss = params.miss
    this.physical = params.physical
    this.message = MSG[params.message as keyof typeof MSG]
    this.actions = params.actions
    this.description = params.description
  }

  toJSON(): BlowJSON {
    return {
      name: this.name,
      cut: this.cut,
      stun: this.stun,
      miss: this.miss,
      physical: this.physical,
      message: enumValueToKeyOrThrow(this.message, MSG),
      actions: this.actions,
      description: this.description,
    }
  }
}
