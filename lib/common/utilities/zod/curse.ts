import { z } from 'zod'
import { CurseRegistry } from '../../objects/curse'

export const z_curse = z.string().transform((str, ctx) => {
  const curse = CurseRegistry.get(str)
  if (curse != null) return curse

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: 'invalid curse type'
  })
  return z.NEVER
})
