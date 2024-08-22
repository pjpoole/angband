import { z } from 'zod'
import { SerializableBase } from '../core/serializable'
import { z_diceExpression } from '../utilities/zod/dice'
import { z_enumFromObject } from '../utilities/zod/enums'

import { C } from '../utilities/colors'
import { KF } from './kindFlags'
import { OF } from './flags'

type ObjectFlag =
  | keyof typeof KF
  | keyof typeof OF

export const ObjectSchema = z.object({
  name: z.string(),
  glyph: z.string().length(1),
  color: z.nativeEnum(C),
  type: z.string(), // TODO: tval
  level: z.number(),
  weight: z.number(),
  cost: z.number(),
  attack: z.object({
    baseDamage: z_diceExpression,
    plusToHit: z.number(),
    plusToDamage: z.number(),
  }),
  armor: z.object({
    baseAC: z.number(),
    plusToAC: z_diceExpression,
  }),
  allocation: z.object({
    commonness:
  }),
  charges: z.number(),
  pile: z.object({
    chance: ,
    number: z.string(), // TODO: dice
  }),
  power: ,
  message: z.string(),
  messageVisible: z.string(),
  effect: z.object({
    effect: ,
    subtype: z.optional(),
    radius: z.number().optional(),
    parameter: z.optional(),
  }),
  effectYX: ,
  dice: z.string(), // TODO: dice
  expression: ,
  flags: z.array(z.string().transform((str, ctx): ObjectFlag => {
      if (Object.keys(KF).includes(str)) {
        return str as keyof typeof KF
      } else if (Object.keys(OF).includes(str)) {
        return str as keyof typeof OF
      }

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'invalid flag type'
      })
      return z.NEVER
    }),
  values: ,
  brand: z.array(z.string()).optional(), // TODO
  slay: z.array(z.string())).optional(), // TODO
  curse: z.object({
    type: z.string(), // TODO: validate
  }),
  pval: ,
  description: z.string(),
})

export const ObjectJSON = z.input<typeof ObjectSchema>
export const ObjectParams = z.output<typeof ObjectSchema>
