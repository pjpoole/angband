import { z } from 'zod'

import { RF } from '../monsters/flags'
import { C } from '../utilities/colors'
import { JsonObject } from '../utilities/json'
import { SerializableBase } from '../core/serializable'

export enum FEAT {
  NONE, /* nothing/unknown */
  FLOOR, /* open floor */
  CLOSED, /* closed door */
  OPEN, /* open door */
  BROKEN, /* broken door */
  LESS, /* up staircase */
  MORE, /* down staircase */
  STORE_GENERAL,
  STORE_ARMOR,
  STORE_WEAPON,
  STORE_BOOK,
  STORE_ALCHEMY,
  STORE_MAGIC,
  STORE_BLACK,
  HOME,
  SECRET, /* secret door */
  RUBBLE, /* impassable rubble */
  MAGMA, /* magma vein wall */
  QUARTZ, /* quartz vein wall */
  MAGMA_K, /* magma vein wall with treasure */
  QUARTZ_K, /* quartz vein wall with treasure */
  GRANITE, /* granite wall */
  PERM, /* permanent wall */
  LAVA,
  PASS_RUBBLE
}

export enum TF {
  NONE,
  LOS,
  PROJECT,
  PASSABLE,
  INTERESTING,
  PERMANENT,
  EASY,
  TRAP,
  NO_SCENT,
  NO_FLOW,
  OBJECT,
  TORCH,
  HIDDEN,
  GOLD,
  FLOOR,
  WALL,
  ROCK,
  GRANITE,
  MAGMA,
  QUARTZ,
  DOOR_ANY,
  DOOR_CLOSED,
  DOOR_JAMMED,
  DOOR_LOCKED,
  CLOSABLE,
  SHOP,
  STAIR,
  UPSTAIR,
  DOWNSTAIR,
  SMOOTH,
  BRIGHT,
  FIERY,
}

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
}

export const FeatureSchema = z.object({
  code: z.nativeEnum(FEAT),
  name: z.string(),
  glyph: z.string().length(1),
  color: z.nativeEnum(C),
  mimic: z.nativeEnum(FEAT).optional(),
  priority: z.number().int(),
  flags: z.set(z.nativeEnum(TF)).optional(),
  digging: z.number(),
  description: z.string(),
  walkMessage: z.string().optional(),
  runMessage: z.string().optional(),
  hurtMessage: z.string().optional(),
  dieMessage: z.string().optional(),
  confusedMessage: z.string().optional(),
  lookPrefix: z.string().optional(),
  lookInPreposition: z.string().optional(),
  resistFlag: z.nativeEnum(RF).optional()
})

export type FeatureParams = z.infer<typeof FeatureSchema>

export class Feature implements SerializableBase {
  readonly code: FEAT
  readonly name: string
  readonly glyph: string
  readonly color: C
  readonly mimic?: FEAT
  readonly priority: number
  readonly flags: Set<TF>
  readonly digging: number
  readonly description: string
  readonly walkMessage?: string
  readonly runMessage?: string
  readonly hurtMessage?: string
  readonly dieMessage?: string
  readonly confusedMessage?: string
  readonly lookPrefix?: string
  readonly lookInPreposition?: string
  readonly resistFlag?: RF

  constructor(params: FeatureParams) {
    this.code = params.code
    this.name = params.name
    this.glyph = params.glyph
    this.color = params.color
    this.mimic = params.mimic
    this.priority = params.priority
    this.flags = params.flags || new Set()
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
