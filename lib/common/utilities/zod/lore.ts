import { z } from 'zod'
import { z_color } from './color'

export const z_blowLore = z.object({
  lore: z.string(),
  colorBase: z_color,
  colorResist: z_color.optional(),
  colorImmune: z_color.optional(),
})

export const z_spellLore = z_blowLore.merge(z.object({
  powerCutoff: z.number().optional(),
  messageSave: z.string(),
  messageVisible: z.string(),
  messageInvisible: z.string(),
  messageMiss: z.string(),
}))

export type zBlowLoreJSON = z.input<typeof z_blowLore>
export type zBlowLoreParams = z.output<typeof z_blowLore>
export type zSpellLoreJSON = z.input<typeof z_spellLore>
export type zSpellLoreParams = z.output<typeof z_spellLore>

export type zLoreColorFields = 'colorBase' | 'colorResist' | 'colorImmune'
