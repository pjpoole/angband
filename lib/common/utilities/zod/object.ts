import { z } from 'zod'
import { z_diceExpression } from './dice'
import { z_tVal } from './tVal'

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

export const z_item = z.object({
  tval: z_tVal,
  sval: z.string(), // TODO: object subvalue lookup
})

export type zAllocationParams = z.output<typeof z_allocation>
export type zArmorJson = z.input<typeof z_armor>
export type zArmorParams = z.output<typeof z_armor>
export type zAttackJson = z.input<typeof z_attack>
export type zAttackParams = z.output<typeof z_attack>
export type zItemJson = z.input<typeof z_item>
export type zItemParams = z.output<typeof z_item>
