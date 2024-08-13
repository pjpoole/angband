import { z } from 'zod'

import { RF } from '../monsters/flags'
import { C } from '../utilities/colors'
import { JsonObject } from '../utilities/json'
import { z_enumFromObject } from '../utilities/zod'
import { SerializableBase } from '../core/serializable'

export const FEAT = {
  NONE: 'NONE', /* nothing/unknown */
  FLOOR: 'FLOOR', /* open floor */
  CLOSED: 'CLOSED', /* closed door */
  OPEN: 'OPEN', /* open door */
  BROKEN: 'BROKEN', /* broken door */
  LESS: 'LESS', /* up staircase */
  MORE: 'MORE', /* down staircase */
  STORE_GENERAL: 'STORE_GENERAL',
  STORE_ARMOR: 'STORE_ARMOR',
  STORE_WEAPON: 'STORE_WEAPON',
  STORE_BOOK: 'STORE_BOOK',
  STORE_ALCHEMY: 'STORE_ALCHEMY',
  STORE_MAGIC: 'STORE_MAGIC',
  STORE_BLACK: 'STORE_BLACK',
  HOME: 'HOME',
  SECRET: 'SECRET', /* secret door */
  RUBBLE: 'RUBBLE', /* impassable rubble */
  MAGMA: 'MAGMA', /* magma vein wall */
  QUARTZ: 'QUARTZ', /* quartz vein wall */
  MAGMA_K: 'MAGMA_K', /* magma vein wall with treasure */
  QUARTZ_K: 'QUARTZ_K', /* quartz vein wall with treasure */
  GRANITE: 'GRANITE', /* granite wall */
  PERM: 'PERM', /* permanent wall */
  LAVA: 'LAVA',
  PASS_RUBBLE: 'PASS_RUBBLE'
} as const

export const TF = {
  NONE: 'NONE',
  LOS: 'LOS',
  PROJECT: 'PROJECT',
  PASSABLE: 'PASSABLE',
  INTERESTING: 'INTERESTING',
  PERMANENT: 'PERMANENT',
  EASY: 'EASY',
  TRAP: 'TRAP',
  NO_SCENT: 'NO_SCENT',
  NO_FLOW: 'NO_FLOW',
  OBJECT: 'OBJECT',
  TORCH: 'TORCH',
  HIDDEN: 'HIDDEN',
  GOLD: 'GOLD',
  FLOOR: 'FLOOR',
  WALL: 'WALL',
  ROCK: 'ROCK',
  GRANITE: 'GRANITE',
  MAGMA: 'MAGMA',
  QUARTZ: 'QUARTZ',
  DOOR_ANY: 'DOOR_ANY',
  DOOR_CLOSED: 'DOOR_CLOSED',
  DOOR_JAMMED: 'DOOR_JAMMED',
  DOOR_LOCKED: 'DOOR_LOCKED',
  CLOSABLE: 'CLOSABLE',
  SHOP: 'SHOP',
  STAIR: 'STAIR',
  UPSTAIR: 'UPSTAIR',
  DOWNSTAIR: 'DOWNSTAIR',
  SMOOTH: 'SMOOTH',
  BRIGHT: 'BRIGHT',
  FIERY: 'FIERY'
} as const

export const TF_DESC = {
  [TF.NONE]:        "",
  [TF.LOS]:         "Allows line of sight",
  [TF.PROJECT]:     "Allows projections to pass through",
  [TF.PASSABLE]:    "Can be passed through by all creatures",
  [TF.INTERESTING]: "Is noticed on looking around",
  [TF.PERMANENT]:   "Is permanent",
  [TF.EASY]:        "Is easily passed through",
  [TF.TRAP]:        "Can hold a trap",
  [TF.NO_SCENT]:    "Cannot store scent",
  [TF.NO_FLOW]:     "No flow through",
  [TF.OBJECT]:      "Can hold objects",
  [TF.TORCH]:       "Becomes bright when torch-lit",
  [TF.HIDDEN]:      "Can be found by searching",
  [TF.GOLD]:        "Contains treasure",
  [TF.FLOOR]:       "Is a clear floor",
  [TF.WALL]:        "Is a solid wall",
  [TF.ROCK]:        "Is rocky",
  [TF.GRANITE]:     "Is a granite rock wall",
  [TF.MAGMA]:       "Is a magma seam",
  [TF.QUARTZ]:      "Is a quartz seam",
  [TF.DOOR_ANY]:    "Is any door",
  [TF.DOOR_CLOSED]: "Is a closed door",
  [TF.DOOR_JAMMED]: "Is a jammed door",
  [TF.DOOR_LOCKED]: "Is a locked door",
  [TF.CLOSABLE]:    "Can be closed",
  [TF.SHOP]:        "Is a shop",
  [TF.STAIR]:       "Is a stair",
  [TF.UPSTAIR]:     "Is an up staircase",
  [TF.DOWNSTAIR]:   "Is a down staircase",
  [TF.SMOOTH]:      "Should have smooth boundaries",
  [TF.BRIGHT]:      "Is internally lit",
  [TF.FIERY]:       "Is fire-based"
} as const

export const FeatureSchema = z.object({
  code: z_enumFromObject(FEAT),
  name: z.string(),
  glyph: z.string().length(1),
  color: z.nativeEnum(C),
  mimic: z_enumFromObject(FEAT).optional(),
  priority: z.number().int(),
  flags: z.array(z_enumFromObject(TF)).optional(),
  digging: z.number(),
  description: z.string(),
  walkMessage: z.string().optional(),
  runMessage: z.string().optional(),
  hurtMessage: z.string().optional(),
  dieMessage: z.string().optional(),
  confusedMessage: z.string().optional(),
  lookPrefix: z.string().optional(),
  lookInPreposition: z.string().optional(),
  resistFlag: z_enumFromObject(RF).optional()
})

export type FeatureParams = z.infer<typeof FeatureSchema>

export class Feature implements SerializableBase {
  readonly code: keyof typeof FEAT
  readonly name: string
  readonly glyph: string
  readonly color: C
  readonly mimic?: keyof typeof FEAT
  readonly priority: number
  readonly flags: Set<keyof typeof TF>
  readonly digging: number
  readonly description: string
  readonly walkMessage?: string
  readonly runMessage?: string
  readonly hurtMessage?: string
  readonly dieMessage?: string
  readonly confusedMessage?: string
  readonly lookPrefix?: string
  readonly lookInPreposition?: string
  readonly resistFlag?: keyof typeof RF

  constructor(params: FeatureParams) {
    this.code = params.code
    this.name = params.name
    this.glyph = params.glyph
    this.color = params.color
    this.mimic = params.mimic
    this.priority = params.priority
    this.flags = new Set(params.flags)
    this.digging = params.digging
    this.description = params.description
    this.walkMessage = params.walkMessage
    this.runMessage = params.runMessage
    this.hurtMessage = params.hurtMessage
    this.dieMessage = params.dieMessage
    this.confusedMessage = params.confusedMessage
    this.lookPrefix = params.lookPrefix
    this.lookInPreposition = params.lookInPreposition
    this.resistFlag = params.resistFlag
  }

  static fromJSON(parsed: JsonObject): Feature {
    const params = FeatureSchema.parse(parsed)

    return new Feature(params)
  }

  toJSON(): JsonObject {
    return {
      code: this.code,
      name: this.name,
      glyph: this.glyph,
      color: C[this.color],
      mimic: this.mimic,
      priority: this.priority,
      flags: Array.from(this.flags.keys()),
      digging: this.digging,
      description: this.description,
      walkMessage: this.walkMessage,
      runMessage: this.runMessage,
      hurtMessage: this.hurtMessage,
      dieMessage: this.dieMessage,
      confusedMessage: this.confusedMessage,
      lookPrefix: this.lookPrefix,
      lookInPreposition: this.lookInPreposition,
      resistFlag: this.resistFlag
    }
  }
}
