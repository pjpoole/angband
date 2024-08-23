import { z } from 'zod'
import { z_diceExpression } from './dice'

export const z_allocation = z.object({
  commonness: z.number(),
  minLevel: z.number(),
  maxLevel: z.number(),
})

export const z_armor = z.object({
  baseAC: z.number(),
  plusToAC: z_diceExpression,
})

export const z_attack = z.object({
  baseDamage: z_diceExpression,
  plusToHit: z_diceExpression,
  plusToDamage: z_diceExpression,
})

export type zAllocationParams = z.output<typeof z_allocation>
export type zArmorJson = z.input<typeof z_armor>
export type zArmorParams = z.output<typeof z_armor>
export type zAttackJson = z.input<typeof z_attack>
export type zAttackParams = z.output<typeof z_attack>
