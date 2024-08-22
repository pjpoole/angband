import { z } from 'zod'
import { TV, TV_NAMES } from '../../objects/tval'

export const z_tVal = z.string().transform((str, ctx): TV => {
  // FIXME: Is there a more elegant way to accomplish this?
  const tval = TV_NAMES[str]
  if (tval) return tval

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: 'invalid TV name'
  })
  return z.NEVER
})
