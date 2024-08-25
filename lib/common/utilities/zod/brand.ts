import { z } from 'zod'
import { BrandRegistry } from '../../objects/brand'

export const z_brand = z.string().transform((val, ctx) => {
  const brand = BrandRegistry.getSafe(val)
  if (brand != null) return brand

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: 'invalid brand',
  })
  return z.NEVER
})
