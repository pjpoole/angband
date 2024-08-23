import { z } from 'zod'
import { NameRegistry } from '../core/Registry'
import { SerializableBase } from '../core/serializable'

import { enumValueSetToArray } from '../utilities/serializing/enum'

import { z_enumValueParser } from '../utilities/zod/enums'
import { z_tVal } from '../utilities/zod/tVal'

import { objectValueToKey } from '../utilities/object'
import { TV, TV_NAMES } from '../objects/tval'

export enum ROOMF {
  FEW_ENTRANCES
}

export const RoomFlagsDescriptions: Record<ROOMF, string> = {
  [ROOMF.FEW_ENTRANCES]: 'select alternate tunneling for a room since it can only be entered from a few directions or the entrances involve digging'
}

const ROOM_TEMPLATE_REGEX = /[ .%#^+123456x()89[]/

export const RoomTemplateSchema = z.object({
  name: z.string(),
  type: z.literal(1),
  rating: z.number().int().min(1).max(3),
  rows: z.number().int().min(1),
  columns: z.number().int().min(1),
  doors: z.number(),
  tval: z_tVal.optional(),
  flags: z.array(z_enumValueParser(ROOMF)).optional(),
  room: z.array(z.string().transform((str) => {
    return str.split('')
  })).refine(
    (room) => {
      for (const row of room) {
        for (const char of row) {
          if (char.length !== 1 || !ROOM_TEMPLATE_REGEX.test(char)) {
            console.log(char)
            return false
          }
        }
      }
      return true
    },
    { message: 'invalid room character' }
  )
}).refine(
  roomTemplate => {
    // This isn't working because of issues with the source data
    // TODO: Check C room template parsing and figure out how it deals with
    //       dimensions being off
    return true /* (
      roomTemplate.room.length === roomTemplate.rows &&
      roomTemplate.room.every(row => row.length === roomTemplate.columns)
    ) */
  },
  { message: 'invalid room dimensions' }
)

export type RoomTemplateJSON = z.input<typeof RoomTemplateSchema>
export type RoomTemplateParams = z.output<typeof RoomTemplateSchema>

export class RoomTemplate extends SerializableBase {
  static readonly schema = RoomTemplateSchema

  readonly name: string
  readonly type: 1
  readonly rating: number
  readonly rows: number
  readonly columns: number
  readonly doors: number
  readonly tval?: TV
  readonly flags: Set<ROOMF>
  readonly room: string[][]

  constructor(params: RoomTemplateParams) {
    super(params)

    this.name = params.name
    this.type = params.type
    this.rating = params.rating
    this.rows = params.rows
    this.columns = params.columns
    this.doors = params.doors
    this.tval = params.tval
    this.flags = new Set(params.flags)
    this.room = params.room
  }

  register() {
    RoomTemplateRegistry.add(this.name, this)
  }

  toJSON(): RoomTemplateJSON {
    return {
      name: this.name,
      type: this.type,
      rating: this.rating,
      rows: this.rows,
      columns: this.columns,
      doors: this.doors,
      tval: objectValueToKey(this.tval, TV_NAMES)!,
      flags: enumValueSetToArray(this.flags, ROOMF),
      room: this.room.map(row => row.join('')),
    }
  }
}

export const RoomTemplateRegistry = new NameRegistry(RoomTemplate)
