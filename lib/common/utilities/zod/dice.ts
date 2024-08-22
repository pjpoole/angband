import { z } from 'zod'
import { stringToDice } from '../dice'

export function z_diceExpression() {
  return z.string().transform((str: string, ctx: z.RefinementCtx) => {
    try {
      return stringToDice(str)
    } catch (e) {
      // TODO: what's the expression?
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'invalid dice expression'
      })

      return z.NEVER
    }
  })
}
