import { z } from 'zod'
import { NameRegistry } from '../core/Registry'
import { SerializableBase } from '../core/serializable'

import { combatToJson } from '../utilities/serializing/combat'
import { effectToJson } from '../utilities/serializing/effect'
import { enumValueSetToArray } from '../utilities/serializing/enum'
import { expressionToJson } from '../utilities/serializing/expression'

import { CombatParams, z_combat } from '../utilities/zod/combat'
import { z_diceExpression } from '../utilities/zod/dice'
import { z_effect } from '../utilities/zod/effect'
import { z_enumValueParser } from '../utilities/zod/enums'
import { z_expression } from '../utilities/zod/expression'
import { z_skill } from '../utilities/zod/skill'

import { Dice } from '../utilities/dice'
import { OF } from '../objects/flags'
import { PF } from './flags'
import { SkillData } from './skill'

export const ShapeSchema = z.object({
  name: z.string(),
  // c-p from curse.ts
  combat: z_combat.optional(),
  skill: z_skill.optional(),
  objectFlags: z.array(z_enumValueParser(OF)).optional(),
  playerFlags: z.array(z_enumValueParser(PF)).optional(),
  values: z.array(z.string()).optional(), // TODO: STAT | OBJ_MOD special parser
  // NB. Shapes load effects, so they have to load after most subeffects load,
  //     but shapes add subeffects, so they have to load prior to things that
  //     depend on shapes
  effects: z.array(z.object({
    effect: z_effect,
    dice: z_diceExpression().optional(),
    expression: z_expression.optional(),
  })).optional(),
  effectMessage: z.string().optional(),
  blow: z.array(z.string()).optional(),
})

export type ShapeJSON = z.input<typeof ShapeSchema>
export type ShapeParams = z.output<typeof ShapeSchema>

const EffectsSchema = ShapeSchema.shape.effects.unwrap()

export type ShapeEffectsJSON = z.input<typeof EffectsSchema.element>
type ShapeEffects = z.output<typeof EffectsSchema.element>

export class Shape extends SerializableBase {
  static schema = ShapeSchema

  readonly name: string
  readonly combat?: CombatParams
  readonly skill?: SkillData
  readonly objectFlags: Set<OF>
  readonly playerFlags: Set<PF>
  readonly values?: string[]
  readonly effects?: ShapeEffects[]
  readonly dice?: Dice[]
  readonly effectMessage?: string
  readonly blow?: string[]

  constructor(params: ShapeParams) {
    super(params)

    this.name = params.name
    this.combat = params.combat
    this.skill = params.skill
    this.objectFlags = new Set(params.objectFlags)
    this.playerFlags = new Set(params.playerFlags)
    this.values = params.values
    this.effects = params.effects
    this.effectMessage = params.effectMessage
    this.blow = params.blow
  }

  register() {
    ShapeRegistry.add(this.name, this)
  }

  private shapeEffectsToJson(): ShapeEffectsJSON[] | undefined {
    if (this.effects == null) return

    return this.effects.map(shapeEffect => {
      return {
        effect: effectToJson(shapeEffect.effect),
        dice: shapeEffect.dice?.toString(),
        expression: expressionToJson(shapeEffect.expression),
      }
    })
  }

  toJSON(): ShapeJSON {
    return {
      name: this.name,
      combat: combatToJson(this.combat),
      skill: this.skill,
      objectFlags: enumValueSetToArray(this.objectFlags, OF),
      playerFlags: enumValueSetToArray(this.playerFlags, PF),
      values: this.values,
      effects: this.shapeEffectsToJson(),
      effectMessage: this.effectMessage,
      blow: this.blow,
    }
  }
}

export const ShapeRegistry = new NameRegistry(Shape)
