import { z } from 'zod'
import { IdRegistry } from '../core/Registry'
import { SerializableBase } from '../core/serializable'

import { onlyIfNonEmpty } from '../utilities/serializing/array'
import { enumValueToKey } from '../utilities/serializing/enum'

import { z_enumValueParser } from '../utilities/zod/enums'

import { DUN } from './dungeonTypes'
import { DungeonGenerator, GENERATORS } from './generators'
import { isValidRoomName } from './roomGenerators'

// TODO: Refine validators for e.g. boundary checks
export const DungeonProfileSchema = z.object({
  name: z_enumValueParser(DUN),
  blockSize: z.number(),
  rooms: z.number().int().nonnegative(),
  unusual: z.number(),
  maxRarity: z.number(),
  tunnel: z.object({
    rnd: z.number(),
    chg: z.number(),
    con: z.number(),
    pen: z.number(),
    jct: z.number()
  }).optional(),
  streamer: z.object({
    den: z.number(),
    rng: z.number(),
    mag: z.number(),
    mc: z.number(),
    qua: z.number(),
    qc: z.number()
  }).optional(),
  allocation: z.number(),
  minLevel: z.number().optional(),
  allowedRooms: z.array(z.object({
    name: z.string().refine(
      name => isValidRoomName(name),
      name => ({ message: `'${name}' is not a valid room name`})
    ),
    rating: z.number(),
    height: z.number(),
    width: z.number(),
    level: z.number(),
    pit: z.boolean(),
    rarity: z.number(),
    cutoff: z.number()
  })).optional()
})

export type DungeonProfileJSON = z.input<typeof DungeonProfileSchema>
export type DungeonProfileParams = z.output<typeof DungeonProfileSchema>

interface Tunnel {
  rnd: number
  chg: number
  con: number
  pen: number
  jct: number
}

interface Streamer {
  den: number
  rng: number
  mag: number
  mc: number
  qua: number
  qc: number
}

export interface Room {
  name: string
  rating: number
  height: number
  width: number
  level: number
  pit: boolean
  rarity: number
  cutoff: number
}

export class DungeonProfile extends SerializableBase {
  static schema = DungeonProfileSchema

  readonly name: DUN
  readonly blockSize: number
  readonly rooms: number
  readonly unusual: number
  readonly maxRarity: number
  readonly allocation: number
  readonly minLevel: number
  readonly tunnel?: Tunnel
  readonly streamer?: Streamer
  readonly allowedRooms: Room[]

  readonly generator: DungeonGenerator

  constructor(params: DungeonProfileParams) {
    super(params)

    this.name = params.name
    this.blockSize = params.blockSize
    this.rooms = params.rooms
    this.unusual = params.unusual
    this.maxRarity = params.maxRarity
    this.allocation = params.allocation ?? 0
    this.minLevel = params.minLevel ?? 0
    this.tunnel = params.tunnel
    this.streamer = params.streamer
    this.allowedRooms = params.allowedRooms ?? []

    this.generator = GENERATORS[this.name]
  }

  register() {
    DungeonProfileRegistry.add(this.name, this)
  }

  toJSON(): DungeonProfileJSON {
    return {
      name: enumValueToKey(this.name, DUN),
      blockSize: this.blockSize,
      rooms: this.rooms,
      unusual: this.unusual,
      maxRarity: this.maxRarity,
      allocation: this.allocation,
      minLevel: this.minLevel,
      tunnel: this.tunnel,
      streamer: this.streamer,
      allowedRooms: onlyIfNonEmpty(this.allowedRooms),
    }
  }
}

export const DungeonProfileRegistry = new IdRegistry(DungeonProfile)
