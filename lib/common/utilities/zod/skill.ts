import { z } from 'zod'

export const z_skill = z.object({
  device: z.number().optional(),
  dig: z.number().optional(),
  disarm: z.number().optional(),
  disarmMagic: z.number().optional(),
  disarmPhysical: z.number().optional(),
  melee: z.number().optional(),
  save: z.number().optional(),
  search: z.number().optional(),
  shoot: z.number().optional(),
  stealth: z.number().optional(),
  throw: z.number().optional(),
})
