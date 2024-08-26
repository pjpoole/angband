import { z } from 'zod'
import { lookupMonster } from '../../monsters/monster'

export const z_monster = z.string().transform((str, ctx) => {
  const monster = lookupMonster(str)
  if (monster != null) return monster

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: 'invalid monster type'
  })
  return z.NEVER
})
