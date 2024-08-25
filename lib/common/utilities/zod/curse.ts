import { z } from 'zod'
import { CurseRegistry } from '../../objects/curse'

export const z_curse = z.string().transform((str, ctx) => {
  const curse = CurseRegistry.getSafe(str)
  if (curse != null) return curse

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: 'invalid curse type'
  })
  return z.NEVER
})

export const z_objectCurse = z.object({
  curse: z_curse,
  power: z.number().positive(),
})

export type zObjectCurseJson = z.input<typeof z_objectCurse>
export type zObjectCurseParams = z.output<typeof z_objectCurse>
