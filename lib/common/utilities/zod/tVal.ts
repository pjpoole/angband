import { z } from 'zod'
import { TV, TV_NAMES } from '../../objects/tval'

export const z_tVal = z.string().transform((str, ctx): TV => {
  const tval = TV_NAMES[str]
  if (tval != null) return tval

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: 'invalid TV name'
  })
  return z.NEVER
})
