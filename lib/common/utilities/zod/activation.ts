import { z } from 'zod'
import { ActivationRegistry } from '../../objects/activation'
import { z_diceExpression } from './dice'

export const z_activation = z.string().transform((val, ctx) => {
  const activation = ActivationRegistry.getSafe(val)
  if (activation != null) return activation

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: 'invalid activation',
  })
  return z.NEVER
})

export const z_objectActivation = z.object({
  activation: z_activation,
  time: z_diceExpression.optional(),
  message: z.string().optional(),
})

export type zObjectActivationJson = z.input<typeof z_objectActivation>
export type zObjectActivationParams = z.output<typeof z_objectActivation>
