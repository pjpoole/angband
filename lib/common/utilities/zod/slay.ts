import { z } from 'zod'
import { stricmp } from '../string'
import { SlayRegistry } from '../../objects/slay'

export const z_slay = z.string().transform((str, ctx) => {
  const slay = SlayRegistry.getSafe(str)
  if (slay != null) return slay

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: 'invalid slay type'
  })
  return z.NEVER
})
