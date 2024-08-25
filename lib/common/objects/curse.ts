import { z } from 'zod'
import { NameRegistry } from '../core/Registry'
import { SerializableBase } from '../core/serializable'

import { combatToJson } from '../utilities/serializing/combat'
import { effectToJson } from '../utilities/serializing/effect'
import { enumValueSetToArray } from '../utilities/serializing/enum'
import { expressionToJson } from '../utilities/serializing/expression'
import { ifExists } from '../utilities/serializing/helpers'
import { setToJson } from '../utilities/serializing/set'
import { valueParamsToJson } from '../utilities/serializing/values'

import { z_combat, zCombatParams } from '../utilities/zod/combat'
import { z_diceExpression } from '../utilities/zod/dice'
import { z_effect, zEffectParams } from '../utilities/zod/effect'
import { z_enumValueParser } from '../utilities/zod/enums'
import { z_expression, zExpressionParams } from '../utilities/zod/expression'
import { CurseFlag, z_curseFlag } from '../utilities/zod/flags'
import { z_objectBase } from '../utilities/zod/objectBase'
import { z_value } from '../utilities/zod/values'

import type { Dice } from '../utilities/dice'
import { ValueParams } from '../utilities/values'

import { OF } from './flags'
import { ObjectBase } from './objectBase'

export const CurseSchema = z.object({
  name: z.string(),
  types: z.array(z_objectBase),
  weight: z.number().optional(), // never used
  combat: z_combat.optional(),
  effect: z.array(z_effect).optional(),
  dice: z_diceExpression.optional(),
  expression: z_expression.optional(),
  time: z_diceExpression.optional(),
  flags: z.array(z_curseFlag).optional(),
  values: z.array(z_value).optional(),
  message: z.string().optional(),
  description: z.string(),
  conflicts: z.array(z.string()).optional(),
  conflictFlags: z.array(z_enumValueParser(OF)).optional(),
})

export type CurseJSON = z.input<typeof CurseSchema>
export type CurseParams = z.output<typeof CurseSchema>

export class Curse extends SerializableBase {
  static readonly schema = CurseSchema

  readonly name: string
  readonly types: ObjectBase[] // TODO: Set?
  readonly weight?: number
  readonly combat?: zCombatParams
  readonly effect?: zEffectParams[]
  readonly dice?: Dice
  readonly expression?: zExpressionParams
  readonly time?: Dice
  readonly flags: Set<CurseFlag>
  readonly values?: ValueParams[] // TODO: Set?
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

  register() {
    CurseRegistry.add(this.name, this)
  }

  toJSON(): CurseJSON {
    return {
      name: this.name,
      types: this.types.map(objectBase => objectBase.typeName),
      weight: this.weight,
      combat: ifExists(this.combat, combatToJson),
      effect: this.effect == null ? undefined : this.effect.map(effectToJson),
      dice: this.dice?.toString(),
      expression: ifExists(this.expression, expressionToJson),
      time: this.time?.toString(),
      flags: setToJson(this.flags),
      values: ifExists(this.values, valueParamsToJson),
      message: this.message,
      description: this.description,
      conflicts: this.conflicts,
      conflictFlags: enumValueSetToArray(this.conflictFlags, OF),
    }
  }
}

class CurseNameRegistry extends NameRegistry<Curse, CurseParams> {
  override finalize(): boolean {
    const firstTime = super.finalize()

    // TODO: maybe hydrate conflicts at this point?
    for (const curse of this.data.values()) {
      for (const conflict of curse.conflicts ?? []) {
        if (!this.getSafe(conflict)) {
          throw new Error(
            'invalid conflict for curse',
            { cause: { key: conflict } }
          )
        }
      }
    }

    return firstTime
  }
}

export const CurseRegistry = new CurseNameRegistry(Curse)
