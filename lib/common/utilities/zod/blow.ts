import { z } from 'zod'
import { BlowRegistry } from '../../monsters/blows'

export const z_blow = z.string().transform((str, ctx) => {
  const blow = BlowRegistry.get(str)
  if (blow != null) return blow

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: 'invalid blow'
  })
  return z.NEVER
})
