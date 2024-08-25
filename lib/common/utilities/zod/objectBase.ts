import { z } from 'zod'
import { ObjectBaseRegistry } from '../../objects/objectBase'

export const z_objectBase = z.string().transform((str, ctx) => {
  const objectBase = ObjectBaseRegistry.getSafe(str)
  if (objectBase != null) return objectBase

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: 'invalid object base type'
  })
  return z.NEVER
})
