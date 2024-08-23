import { z } from 'zod'
import { colorStringToAttribute, isColorString } from '../colors'

export const z_color = z.string().transform((val, ctx) => {
  if (!isColorString(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'invalid color name or id',
    })
    return z.NEVER
  }

  return colorStringToAttribute(val)
})
