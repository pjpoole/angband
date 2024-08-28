import { z } from 'zod'
import { NameRegistry } from '../core/Registry'
import { SerializableBase } from '../core/serializable'

import { enumValueSetToArray } from '../utilities/serializing/enum'

import { z_enumValueParser } from '../utilities/zod/enums'
import { z_tVal } from '../utilities/zod/tVal'

import { objectValueToKey } from '../utilities/object'
import { Rectangle, stringRectangleToRows } from '../utilities/rectangle'
import { TV, TV_NAMES } from '../objects/tval'

// list-room-flags.h
export enum ROOMF {
  FEW_ENTRANCES
}

export const RoomFlagsDescriptions: Record<ROOMF, string> = {
  [ROOMF.FEW_ENTRANCES]: 'select alternate tunneling for a room since it can only be entered from a few directions or the entrances involve digging'
}

const ROOM_TEMPLATE_REGEX = /[ .%#^+123456x()89[]/

function checkRoomCharacters(room: string[][]) {
  for (const row of room) {
    for (const char of row) {
      if (char.length !== 1 || !ROOM_TEMPLATE_REGEX.test(char)) {
        console.log(char)
        return false
      }
    }
  }
  return true
}

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
  })).refine(checkRoomCharacters, { message: 'invalid room character' })
})

export type RoomTemplateJSON = z.input<typeof RoomTemplateSchema>
export type RoomTemplateParams = z.output<typeof RoomTemplateSchema>

export class RoomTemplate extends SerializableBase {
  static readonly schema = RoomTemplateSchema

  readonly name: string
  readonly type: 1
  readonly rating: number
  readonly height: number
  readonly width: number
  readonly doors: number
  readonly tval?: TV
  readonly flags: Set<ROOMF>
  readonly room: Rectangle<string>

  constructor(params: RoomTemplateParams) {
    super(params)

    this.name = params.name
    this.type = params.type
    this.rating = params.rating
    this.height = params.rows
    this.width = params.columns
    this.doors = params.doors
    this.tval = params.tval
    this.flags = new Set(params.flags)
    // TODO: Bad input data
    this.room = new Rectangle(params.room.length, params.room[0].length, ({ x, y}) => {
      return params.room[y][x]
    })
  }

  register() {
    RoomTemplateRegistry.add(this.name, this)
  }

  toJSON(): RoomTemplateJSON {
    return {
      name: this.name,
      type: this.type,
      rating: this.rating,
      rows: this.height,
      columns: this.width,
      doors: this.doors,
      tval: objectValueToKey(this.tval, TV_NAMES)!,
      flags: enumValueSetToArray(this.flags, ROOMF),
      room: stringRectangleToRows(this.room),
    }
  }
}

export const RoomTemplateRegistry = new NameRegistry(RoomTemplate)
