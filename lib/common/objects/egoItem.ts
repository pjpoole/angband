import { z } from 'zod'
import { NameRegistry } from '../core/Registry'
import { SerializableBase } from '../core/serializable'

import { activationToJson } from '../utilities/serializing/activation'
import { combatMinToJson, combatToJson } from '../utilities/serializing/combat'
import { ifExists } from '../utilities/serializing/helpers'
import { curseObjectToJson, itemToJson } from '../utilities/serializing/object'
import { setToJson } from '../utilities/serializing/set'
import { valueParamsToJson } from '../utilities/serializing/values'

import {
  z_objectActivation,
  zObjectActivationParams
} from '../utilities/zod/activation'
import { z_brand } from '../utilities/zod/brand'
import {
  z_combat,
  z_combatMin,
  zCombatMinParams,
  zCombatParams,
} from '../utilities/zod/combat'
import { z_objectCurse, zObjectCurseParams } from '../utilities/zod/curse'
import { ObjectFlag, z_objectFlag } from '../utilities/zod/flags'
import {
  z_allocation,
  z_item,
  zAllocationParams,
  zItemParams
} from '../utilities/zod/object'
import { z_slay } from '../utilities/zod/slay'
import { z_tVal } from '../utilities/zod/tVal'
import { z_value } from '../utilities/zod/values'

import { objectValueToKey } from '../utilities/object'
import { ValueParams } from '../utilities/values'
import { TV, TV_NAMES } from './tval'
import { Slay } from './slay'
import { Brand } from './brand'

export const EgoItemSchema = z.object({
  name: z.string(),
  cost: z.number(),
  rating: z.number(),
  allocation: z_allocation,
  combat: z_combat.optional(),
  combatMin: z_combatMin.optional(), // TODO: 255 means "there is no min"
  types: z.array(z_tVal).optional(),
  items: z.array(z_item).optional(),
  flags: z.array(z_objectFlag).optional(),
  flagsOff: z.array(z_objectFlag).optional(),
  values: z.array(z_value).optional(), // TODO: Dice work differently on values than other places; figure out how they differ
  valuesMin: z.array(z_value.refine(
    (val) => {
      return !(val.value.x || val.value.y || val.value.m)
    },
    { message: 'value min does not permit random values' }
  )).optional(),
  activation: z_objectActivation.optional(),
  brands: z.array(z_brand).optional(),
  slays: z.array(z_slay).optional(),
  curses: z.array(z_objectCurse).optional(),
  description: z.string().optional(),
}).refine(
  (obj) => {
    // 'of Fury' is an exception and is not creatable at the moment
    // TODO: Just dispose of values that can't be created?
    return obj.name === 'of Fury' || obj.types != null || obj.items != null
  },
  { message: 'at least one of types or items must have a value' }
)

export type EgoItemJSON = z.input<typeof EgoItemSchema>
export type EgoItemParams = z.output<typeof EgoItemSchema>

export class EgoItem extends SerializableBase {
  static readonly schema = EgoItemSchema

  readonly name: string
  readonly cost: number
  readonly rating: number
  readonly allocation: zAllocationParams
  readonly combat?: zCombatParams
  readonly combatMin?: zCombatMinParams
  readonly types?: TV[]
  readonly items?: zItemParams[]
  readonly flags: Set<ObjectFlag>
  readonly flagsOff: Set<ObjectFlag>
  readonly values?: ValueParams[]
  readonly valuesMin?: ValueParams[]
  readonly activation?: zObjectActivationParams
  readonly brands?: Brand[]
  readonly slays?: Slay[]
  readonly curses?: zObjectCurseParams[]
  readonly description?: string

  constructor(params: EgoItemParams) {
    super(params)

    this.name = params.name
    this.cost = params.cost
    this.rating = params.rating
    this.allocation = params.allocation
    this.combat = params.combat
    this.combatMin = params.combatMin
    this.types = params.types
    this.items = params.items
    this.flags = new Set(params.flags)
    this.flagsOff = new Set(params.flagsOff)
    this.values = params.values
    this.valuesMin = params.valuesMin
    this.activation = params.activation
    this.brands = params.brands
    this.slays = params.slays
    this.curses = params.curses
    this.description = params.description
  }

  register() {
    EgoItemRegistry.add(this.name, this)
  }

  toJSON(): EgoItemJSON {
    return {
      name: this.name,
      cost: this.cost,
      rating: this.rating,
      allocation: this.allocation,
      combat: ifExists(this.combat, combatToJson),
      combatMin: ifExists(this.combatMin, combatMinToJson),
      types: this.types?.map(type => objectValueToKey(type, TV_NAMES)!),
      items: this.items?.map(itemToJson),
      flags: setToJson(this.flags),
      flagsOff: setToJson(this.flagsOff),
      values: ifExists(this.values, valueParamsToJson),
      valuesMin: ifExists(this.valuesMin, valueParamsToJson),
      activation: ifExists(this.activation, activationToJson),
      brands: this.brands?.map(brand => brand.name),
      slays: this.slays?.map(slay => slay.name),
      curses: this.curses?.map(curseObjectToJson),
      description: this.description,
    }
  }
}

export const EgoItemRegistry = new NameRegistry(EgoItem)
