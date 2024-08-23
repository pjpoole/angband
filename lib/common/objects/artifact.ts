import { z } from 'zod'
import { NameRegistry } from '../core/Registry'
import { SerializableBase } from '../core/serializable'

import { activationToJson } from '../utilities/serializing/activation'
import { enumValueToKey } from '../utilities/serializing/enum'
import { ifExists } from '../utilities/serializing/helpers'
import {
  armorToJson,
  attackToJson,
  curseObjectToJson
} from '../utilities/serializing/object'
import { setToJson } from '../utilities/serializing/set'
import { valueParamsToJson } from '../utilities/serializing/values'

import {
  z_objectActivation,
  zObjectActivationParams
} from '../utilities/zod/activation'
import { z_brand } from '../utilities/zod/brand'
import { z_objectCurse, zObjectCurseParams } from '../utilities/zod/curse'
import { ObjectFlag, z_objectFlag } from '../utilities/zod/flags'
import {
  z_allocation,
  z_armor,
  z_attack,
  zAllocationParams,
  zArmorParams,
  zAttackParams
} from '../utilities/zod/object'
import { z_slay } from '../utilities/zod/slay'
import { z_value } from '../utilities/zod/values'
import { z_tVal } from '../utilities/zod/tVal'

import { C } from '../utilities/colors'
import { ValueParams } from '../utilities/values'
import { TV, TV_NAMES } from './tval'
import { Brand } from './brand'
import { Slay } from './slay'
import { objectValueToKey } from '../utilities/object'

export const ArtifactSchema = z.object({
  name: z.string(),
  type: z_tVal,
  sval: z.string(), // TODO: object subvalue lookup
  glyph: z.string().length(1).optional(), // derives from base type, then
  color: z.nativeEnum(C).optional(),
  level: z.number(),
  weight: z.number(),
  cost: z.number(),
  allocation: z_allocation,
  attack: z_attack.optional(),
  armor: z_armor.optional(),
  flags: z.array(z_objectFlag).optional(),
  activation: z_objectActivation.optional(),
  values: z.array(z_value).optional(),
  brands: z.array(z_brand).optional(),
  slays: z.array(z_slay).optional(),
  curses: z.array(z_objectCurse).optional(),
  description: z.string(),
})

export type ArtifactJSON = z.input<typeof ArtifactSchema>
export type ArtifactParams = z.output<typeof ArtifactSchema>

export class Artifact extends SerializableBase {
  static readonly schema = ArtifactSchema

  readonly name: string
  readonly type: TV
  readonly sval: string
  readonly glyph?: string
  readonly color?: C
  readonly level: number
  readonly weight: number
  readonly cost: number
  readonly allocation: zAllocationParams
  readonly attack?: zAttackParams
  readonly armor?: zArmorParams
  readonly flags: Set<ObjectFlag>
  readonly activation?: zObjectActivationParams
  readonly values?: ValueParams[]
  readonly brands?: Brand[]
  readonly slays?: Slay[]
  readonly curses?: zObjectCurseParams[]
  readonly description: string

  constructor(params: ArtifactParams) {
    super(params)

    this.name = params.name
    this.type = params.type
    this.sval = params.sval
    this.glyph = params.glyph
    this.color = params.color
    this.level = params.level
    this.weight = params.weight
    this.cost = params.cost
    this.allocation = params.allocation
    this.attack = params.attack
    this.armor = params.armor
    this.flags = new Set(params.flags)
    this.activation = params.activation
    this.values = params.values
    this.brands = params.brands
    this.slays = params.slays
    this.curses = params.curses
    this.description = params.description
  }

  register() {
    ArtifactRegistry.add(this.name, this)
  }

  toJSON(): ArtifactJSON {
    return {
      name: this.name,
      type: objectValueToKey(this.type, TV_NAMES)!,
      sval: this.sval,
      glyph: this.glyph,
      color: this.color,
      level: this.level,
      weight: this.weight,
      cost: this.cost,
      allocation: this.allocation,
      attack: ifExists(this.attack, attackToJson),
      armor: ifExists(this.armor, armorToJson),
      flags: setToJson(this.flags),
      activation: ifExists(this.activation, activationToJson),
      values: ifExists(this.values, valueParamsToJson),
      brands: this.brands?.map(brand => brand.name),
      slays: this.slays?.map(slay => slay.name),
      curses: this.curses?.map(curseObjectToJson),
      description: this.description,
    }
  }
}

export const ArtifactRegistry = new NameRegistry(Artifact)
