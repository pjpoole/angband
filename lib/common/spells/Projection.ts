import { z } from 'zod'
import { IdRegistry } from '../core/Registry'
import { SerializableBase } from '../core/serializable'
import { z_diceExpression } from '../utilities/zod'
import { z_enumValueParser } from '../utilities/zod/enums'

import { C } from '../utilities/colors'
import { Dice } from '../utilities/dice'
import { enumValueToKey } from '../utilities/enum'

import { ELEM } from './elements'
import { MSG } from '../game/messages'
import { PROJ } from './projections'

export const PROJECTION_TYPES = ['element', 'environs', 'monster'] as const

export type ProjectionTypes = typeof PROJECTION_TYPES[number]

const ProjectionSchemaBase = z.object({
  type: z.string(),
  description: z.string(),
  playerDescription: z.string().optional(),
  blindDescription: z.string(),
  lashDescription: z.string().optional(),
  numerator: z.number().optional(),
  denominator: z_diceExpression().optional(),
  divisor: z.number().optional(),
  damageCap: z.number().optional(),
  // TODO: find out how messageType is backfilled in code
  messageType: z_enumValueParser(MSG).optional(),
  obvious: z.boolean(),
  wake: z.boolean().optional(),
  color: z.nativeEnum(C)
})

/*
 * Elements and non-elements are more sharply divided than this; in particular:
 * - numerator
 * - denominator
 * - divisor
 * - damageCap
 *
 * only exist on elements
 */
export const ProjectionSchema = z.discriminatedUnion('type', [
  ProjectionSchemaBase.merge(z.object({
    type: z.literal('element'),
    name: z.string(),
    code: z_enumValueParser(ELEM)
  })),
  ProjectionSchemaBase.merge(z.object({
    type: z.enum(['environs', 'monster'] as const),
    name: z.undefined(),
    code: z_enumValueParser(PROJ),
  }))
])

export type ProjectionJSON = z.input<typeof ProjectionSchema>
export type ProjectionParams = z.output<typeof ProjectionSchema>

export class Projection extends SerializableBase {
  static readonly schema = ProjectionSchema

  readonly code: ELEM | PROJ
  readonly name?: string
  readonly type: ProjectionTypes
  readonly description: string
  readonly playerDescription?: string
  readonly blindDescription: string
  readonly lashDescription?: string
  readonly numerator?: number
  readonly denominator?: Dice
  readonly divisor?: number
  readonly damageCap?: number
  readonly messageType?: MSG
  readonly obvious: boolean
  readonly wake?: boolean
  readonly color: C

  constructor(params: ProjectionParams) {
    super(params)

    this.code = params.code
    this.name = params.name
    this.type = params.type
    this.description = params.description
    this.playerDescription = params.playerDescription
    this.blindDescription = params.blindDescription
    this.lashDescription = params.lashDescription
    this.numerator = params.numerator
    this.denominator = params.denominator
    this.divisor = params.divisor
    this.damageCap = params.damageCap
    this.messageType = params.messageType
    this.obvious = params.obvious
    this.wake = params.wake
    this.color = params.color
  }

  register() {
    ProjectionRegistry.add(this.id, this)
  }

  toJSON(): ProjectionJSON {
    const projectionBase = {
      description: this.description,
      playerDescription: this.playerDescription,
      blindDescription: this.blindDescription,
      lashDescription: this.lashDescription,
      numerator: this.numerator,
      denominator: this.denominator?.toString(),
      divisor: this.divisor,
      damageCap: this.damageCap,
      messageType: enumValueToKey(this.messageType, MSG),
      obvious: this.obvious,
      wake: this.wake,
      color: this.color,
    }

    const type = this.type

    if (type === 'element') {
      return {
        type,
        name: this.name as string,
        code: enumValueToKey(this.code, ELEM) as keyof typeof ELEM,
        ...projectionBase,
      }
    } else {
      return {
        type,
        name: undefined,
        code: enumValueToKey(this.code, PROJ) as keyof typeof PROJ,
        ...projectionBase,
      }
    }

  }
}

export const ProjectionRegistry = new IdRegistry(Projection)
