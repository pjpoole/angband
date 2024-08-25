import { z } from 'zod'
import { MonsterBaseRegistry } from '../../monsters/monsterBase'

export const z_monsterBase = z.string().transform((str, ctx) => {
  const monsterBase = MonsterBaseRegistry.getSafe(str)
  if (monsterBase != null) return monsterBase

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: 'invalid monster base type'
  })
  return z.NEVER
})
