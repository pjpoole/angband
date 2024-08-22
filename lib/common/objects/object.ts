import { z } from 'zod'
import { IdRegistry } from '../core/Registry'
import { SerializableBase } from '../core/serializable'

import { enumValueToKey } from '../utilities/serializing/enum'
import { ifExists } from '../utilities/serializing/helpers'
import { setToJson } from '../utilities/serializing/set'
import { valueParamsToJson } from '../utilities/serializing/values'

import { z_curse } from '../utilities/zod/curse'
import { z_diceExpression } from '../utilities/zod/dice'
import { z_effect } from '../utilities/zod/effect'
import { z_expression } from '../utilities/zod/expression'
import { ObjectFlag, z_objectFlag } from '../utilities/zod/flags'
import { z_slay } from '../utilities/zod/slay'
import { z_tVal } from '../utilities/zod/tVal'
import { z_value } from '../utilities/zod/values'

import { C } from '../utilities/colors'
import { Dice } from '../utilities/dice'
import { ValueParams } from '../utilities/values'
import { TV } from './tval'
import { Slay } from './slay'
import { effectToJson } from '../utilities/serializing/effect'
import { expressionToJson } from '../utilities/serializing/expression'

const allocation = z.object({
  commonness: z.number(),
  minLevel: z.number(),
  maxLevel: z.number(),
})

const armor = z.object({
  baseAC: z.number(),
  plusToAC: z_diceExpression,
})

const attack = z.object({
  baseDamage: z_diceExpression,
  plusToHit: z.number(),
  plusToDamage: z.number(),
})

const curse = z.object({
  curse: z_curse,
  power: z.number().positive(),
})

const effect = z.object({
  effect: z_effect,
  x: z.number().optional(),
  y: z.number().optional(),
  dice: z_diceExpression.optional(),
  expression: z_expression.optional(),
})


const pile = z.object({
  chance: z.number(),
  number: z_diceExpression,
})

export const AngbandObjectSchema = z.object({
  name: z.string(),
  glyph: z.string().length(1),
  color: z.nativeEnum(C),
  type: z_tVal,
  level: z.number().optional(),
  weight: z.number().optional(),
  cost: z.number().optional(),
  attack: attack.optional(),
  armor: armor.optional(),
  allocation: allocation.optional(),
  charges: z_diceExpression.optional(),
  pile: pile.optional(),
  flags: z.array(z_objectFlag).optional(),
  values: z.array(z_value).optional(),
  slay: z.array(z_slay).optional(),
  power: z.number().optional(),
  curses: z.array(curse).optional(),
  message: z.string().optional(),
  messageVisible: z.string().optional(),
  effects: z.array(effect).optional(),
  pval: z.number().optional(),
  description: z.string().optional(),
})

export type AngbandObjectJSON = z.input<typeof AngbandObjectSchema>
export type AngbandObjectParams = z.output<typeof AngbandObjectSchema>

type ObjectAllocation = z.output<typeof allocation>
type ObjectArmorJson = z.input<typeof armor>
type ObjectArmor = z.output<typeof armor>
type ObjectAttackJson = z.input<typeof attack>
type ObjectAttack = z.output<typeof attack>
type ObjectCurse = z.output<typeof curse>
type ObjectEffect = z.output<typeof effect>
type ObjectPile = z.output<typeof pile>

export class AngbandObject extends SerializableBase {
  readonly name: string
  readonly glyph: string
  readonly color: C
  readonly type: TV
  readonly level?: number
  readonly weight?: number
  readonly cost?: number
  readonly attack?: ObjectAttack
  readonly armor?: ObjectArmor
  readonly allocation?: ObjectAllocation
  readonly charges?: Dice
  readonly pile?: ObjectPile
  readonly flags: Set<ObjectFlag>
  readonly values?: ValueParams[]
  readonly slay?: Slay[]
  readonly power?: number
  readonly curses?: ObjectCurse[]
  readonly message?: string
  readonly messageVisible?: string
  readonly effects?: ObjectEffect[]
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
      color: this.color,
      type: enumValueToKey(this.type, TV) as keyof typeof TV,
      level: this.level,
      weight: this.weight,
      cost: this.cost,
      attack: ifExists(this.attack, (attack) => {
        return {
          baseDamage: attack.baseDamage.toString(),
          plusToHit: attack.plusToHit,
          plusToDamage: attack.plusToDamage,
        } as ObjectAttackJson
      }),
      armor: ifExists(this.armor, (armor) => {
        return {
          baseAC: armor.baseAC,
          plusToAC: armor.plusToAC.toString(),
        } as ObjectArmorJson
      }),
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
      slay: this.slay?.map(slay => slay.name),
      power: this.power,
      curses: this.curses?.map(curse => {
        return {
          curse: curse.curse.name,
          power: curse.power,
        }
      }),
      message: this.message,
      messageVisible: this.messageVisible,
      effects: this.effects == null ? undefined : this.effects.map(el => {
        return {
          effect: effectToJson(el.effect),
          x: el.x,
          y: el.y,
          dice: el.dice?.toString(),
          expression: ifExists(el.expression, expressionToJson),
        }
      }),
      pval: this.pval,
      description: this.description,
    }
  }
}

export const AngbandObjectRegistry = new IdRegistry(AngbandObject)
