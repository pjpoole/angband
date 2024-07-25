import { GameObject } from '../GameObject'
import { RF } from '../monsters/flags'
import { C } from '../utilities/colors'

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
  CLOSABLE,
  FLOOR,
  WALL,
  ROCK,
  GRANITE,
  DOOR_ANY,
  DOOR_CLOSED,
  SHOP,
  DOOR_JAMMED,
  DOOR_LOCKED,
  MAGMA,
  QUARTZ,
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
  [TF.CLOSABLE]:    "Can be closed",
  [TF.FLOOR]:       "Is a clear floor",
  [TF.WALL]:        "Is a solid wall",
  [TF.ROCK]:        "Is rocky",
  [TF.GRANITE]:     "Is a granite rock wall",
  [TF.DOOR_ANY]:    "Is any door",
  [TF.DOOR_CLOSED]: "Is a closed door",
  [TF.SHOP]:        "Is a shop",
  [TF.DOOR_JAMMED]: "Is a jammed door",
  [TF.DOOR_LOCKED]: "Is a locked door",
  [TF.MAGMA]:       "Is a magma seam",
  [TF.QUARTZ]:      "Is a quartz seam",
  [TF.STAIR]:       "Is a stair",
  [TF.UPSTAIR]:     "Is an up staircase",
  [TF.DOWNSTAIR]:   "Is a down staircase",
  [TF.SMOOTH]:      "Should have smooth boundaries",
  [TF.BRIGHT]:      "Is internally lit",
  [TF.FIERY]:       "Is fire-based"
}

export interface FeatureParams extends GameObject {
  code: FEAT
  name: string
  glyph: string // char
  color: C
  mimic?: FEAT
  priority: number
  flags: Set<TF>
  digging: number
  description: string
  walkMessage?: string
  runMessage?: string
  hurtMessage?: string
  dieMessage?: string
  confusedMessage?: string
  lookPrefix?: string
  lookInPreposition?: string
  resistFlag?: RF
}

export class Feature {
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
    Object.assign(this, params)
  }
}
