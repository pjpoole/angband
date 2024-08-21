import { z } from 'zod'
import { SerializableBase } from '../core/serializable'
import {
  CombatParams,
  combatToJson,
  effectToJson,
  z_combat,
  z_diceExpression,
  z_effect,
  z_enumValueParser,
  z_expression,
  zEffectParams,
  zExpressionParams,
} from '../utilities/zod'

import type { Dice } from '../utilities/dice'
import { OF } from './flags'
import {
  HATES_ELEM,
  IGNORE_ELEM,
  isHatesElem,
  isIgnoreElem,
} from '../spells/elements'
import { ObjectBase } from './objectBase'
import { ObjectBaseRegistry } from '../game/registries'
import { enumValueSetToArray } from '../utilities/enum'

export type CurseFlag = keyof typeof OF | HATES_ELEM | IGNORE_ELEM

export const CurseSchema = z.object({
  name: z.string(),
  types: z.array(z.string().transform((str, ctx) => {
    const objectBase = ObjectBaseRegistry.get(str)
    if (objectBase != null) return objectBase

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'invalid object base type'
    })
    return z.NEVER
  })),
  weight: z.number().optional(), // never used
  combat: z_combat.optional(),
  effect: z.array(z_effect).optional(),
  dice: z_diceExpression().optional(),
  // Shows up in shape, activation, class, monster_spell, object, trap
  expression: z_expression.optional(), // TODO
  time: z_diceExpression().optional(),
  flags: z.array(z.string().transform((str, ctx): CurseFlag => {
    if (Object.keys(OF).includes(str)) {
      return str as keyof typeof OF
    } else {
      if (isHatesElem(str)) return str
      else if (isIgnoreElem(str)) return str
    }

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'invalid flag type'
    })
    return z.NEVER
  })).optional(),
  values: z.array(z.string()).optional(), // TODO: STAT | OBJ_MOD special parser
  message: z.string().optional(),
  description: z.string(),
  conflicts: z.array(z.string()).optional(), // TODO
  conflictFlags: z.array(z_enumValueParser(OF)).optional(),
})

export type CurseJSON = z.input<typeof CurseSchema>
export type CurseParams = z.output<typeof CurseSchema>

export class Curse extends SerializableBase {
  readonly name: string
  readonly types: ObjectBase[] // TODO: Set?
  readonly weight?: number
  readonly combat?: CombatParams
  readonly effect?: zEffectParams[]
  readonly dice?: Dice
  readonly expression?: zExpressionParams
  readonly time?: Dice
  readonly flags: Set<CurseFlag>
  readonly values?: string[] // TODO: Set?
  readonly message?: string
  readonly description: string
  readonly conflicts?: string[]
  readonly conflictFlags: Set<OF>

  constructor(params: CurseParams) {
    super(params)

    this.name = params.name
    this.types = params.types
    this.weight = params.weight
    this.combat = params.combat
    this.effect = params.effect
    this.dice = params.dice
    this.expression = params.expression
    this.time = params.time
    this.flags = new Set(params.flags)
    this.values = params.values
    this.message = params.message
    this.description = params.description
    this.conflicts = params.conflicts
    this.conflictFlags = new Set(params.conflictFlags)
  }

  toJSON(): CurseJSON {
    return {
      name: this.name,
      types: this.types.map(objectBase => objectBase.typeName),
      weight: this.weight,
      combat: this.combat ? combatToJson(this.combat) : undefined,
      effect: (this.effect ?? []).map(effectToJson),
      dice: this.dice?.toString(),
      expression: this.expression,
      time: this.time?.toString(),
      flags: Array.from(this.flags),
      values: this.values,
      message: this.message,
      description: this.description,
      conflicts: this.conflicts,
      conflictFlags: enumValueSetToArray(this.conflictFlags, OF),
    }
  }
}
