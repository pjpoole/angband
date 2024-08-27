import { z } from 'zod'
import { IdRegistry } from '../core/Registry'
import { SerializableBase } from '../core/serializable'

import { effectObjectsToJson } from '../utilities/serializing/effect'
import { ifExists } from '../utilities/serializing/helpers'
import {
  armorToJson,
  attackToJson,
  curseObjectToJson
} from '../utilities/serializing/object'
import { setToJson } from '../utilities/serializing/set'
import { valueParamsToJson } from '../utilities/serializing/values'

import { z_color } from '../utilities/zod/color'
import { z_objectCurse, zObjectCurseParams } from '../utilities/zod/curse'
import { z_diceExpression } from '../utilities/zod/dice'
import { z_effectObject, zEffectObjectParams } from '../utilities/zod/effect'
import { ObjectFlag, z_objectFlag } from '../utilities/zod/flags'
import {
  zAllocationParams,
  zArmorParams,
  zAttackParams,
  z_allocation,
  z_armor,
  z_attack
} from '../utilities/zod/object'
import { z_slay } from '../utilities/zod/slay'
import { z_tVal } from '../utilities/zod/tVal'
import { z_value } from '../utilities/zod/values'

import { C, colorCodeToString } from '../utilities/colors'
import { Dice } from '../utilities/dice'
import { objectValueToKey } from '../utilities/object'
import { ValueParams } from '../utilities/values'
import { TV, TV_NAMES } from './tval'
import { Slay } from './slay'

const pile = z.object({
  chance: z.number(),
  number: z_diceExpression,
})

export const AngbandObjectSchema = z.object({
  name: z.string(),
  glyph: z.string().length(1),
  color: z_color,
  type: z_tVal,
  level: z.number().optional(),
  weight: z.number().optional(),
  cost: z.number().optional(),
  attack: z_attack.optional(),
  armor: z_armor.optional(),
  allocation: z_allocation.optional(),
  charges: z_diceExpression.optional(),
  pile: pile.optional(),
  flags: z.array(z_objectFlag).optional(),
  values: z.array(z_value).optional(),
  slay: z.array(z_slay).optional(),
  power: z.number().optional(),
  curses: z.array(z_objectCurse).optional(),
  message: z.string().optional(),
  messageVisible: z.string().optional(),
  effects: z.array(z_effectObject).optional(),
  time: z_diceExpression.optional(),
  pval: z.number().optional(),
  description: z.string().optional(),
})

export type AngbandObjectJSON = z.input<typeof AngbandObjectSchema>
export type AngbandObjectParams = z.output<typeof AngbandObjectSchema>

type ObjectPile = z.output<typeof pile>

export class AngbandObject extends SerializableBase {
  static readonly schema = AngbandObjectSchema

  readonly name: string
  readonly glyph: string
  readonly color: C
  readonly type: TV
  readonly level?: number
  readonly weight?: number
  readonly cost?: number
  readonly attack?: zAttackParams
  readonly armor?: zArmorParams
  readonly allocation?: zAllocationParams
  readonly charges?: Dice
  readonly pile?: ObjectPile
  readonly flags: Set<ObjectFlag>
  readonly values?: ValueParams[]
  readonly slay?: Slay[]
  readonly power?: number
  readonly curses?: zObjectCurseParams[]
  readonly message?: string
  readonly messageVisible?: string
  readonly effects?: zEffectObjectParams[]
  readonly time?: Dice
  readonly pval?: number
  readonly description?: string

  constructor(params: AngbandObjectParams) {
    super(params)

    this.name = params.name
    this.glyph = params.glyph
    this.color = params.color
    this.type = params.type
    this.level = params.level
    this.weight = params.weight
    this.cost = params.cost
    this.attack = params.attack
    this.armor = params.armor
    this.allocation = params.allocation
    this.charges = params.charges
    this.pile = params.pile
    this.flags = new Set(params.flags)
    this.values = params.values
    this.slay = params.slay
    this.power = params.power
    this.curses = params.curses
    this.message = params.message
    this.messageVisible = params.messageVisible
    this.effects = params.effects
    this.time = params.time
    this.pval = params.pval
    this.description = params.description
  }

  register() {
    // TODO: how do we do lookups? Do we do lookups?
    AngbandObjectRegistry.add(this.id, this)
  }

  toJSON(): AngbandObjectJSON {
    return {
      name: this.name,
      glyph: this.glyph,
      color: colorCodeToString(this.color),
      type: objectValueToKey(this.type, TV_NAMES)!,
      level: this.level,
      weight: this.weight,
      cost: this.cost,
      attack: ifExists(this.attack, attackToJson),
      armor: ifExists(this.armor, armorToJson),
      allocation: this.allocation,
      charges: this.charges?.toString(),
      pile: ifExists(this.pile, (pile) => {
        return {
          chance: pile.chance,
          number: pile.number.toString(),
        }
      }),
      flags: setToJson(this.flags),
      values: ifExists(this.values, valueParamsToJson),
      slay: this.slay?.map(slay => slay.code),
      power: this.power,
      curses: this.curses?.map(curseObjectToJson),
      message: this.message,
      messageVisible: this.messageVisible,
      effects: ifExists(this.effects, effectObjectsToJson),
      time: this.time?.toString(),
      pval: this.pval,
      description: this.description,
    }
  }
}

export const AngbandObjectRegistry = new IdRegistry(AngbandObject)
