import { z } from 'zod'
import { NameRegistry } from '../core/Registry'
import { SerializableBase } from '../core/serializable'

import { enumValueSetToArray } from '../utilities/serializing/enum'

import { z_enumValueParser } from '../utilities/zod/enums'

import { Rectangle, stringRectangleToRows } from '../utilities/rectangle'
import { isValidRoomName, RoomName } from './roomGenerators'
import { ROOMF } from './roomTemplate'

const VAULT_REGEX = /[ .%#@*:`/;&+^<>0-9~$\]|="!?_,A-Za-z-]/

function checkRoomCharacters(room: string[][]) {
  for (const row of room) {
    for (const char of row) {
      if (char.length !== 1 || !VAULT_REGEX.test(char)) {
        console.log(char)
        return false
      }
    }
  }
  return true
}

function checkRoomDimensions(roomTemplate: { room: string[][], rows: number, columns: number }): boolean {
  // This isn't working because of issues with the source data
  // TODO: Check C room template parsing and figure out how it deals with
  //       dimensions being off
  return (
    roomTemplate.room.length === roomTemplate.rows &&
    roomTemplate.room.every(row => row.length === roomTemplate.columns)
  )
}

export const VaultSchema = z.object({
  name: z.string(),
  type: z.string().refine(isValidRoomName, { message: 'invalid room name' }),
  rating: z.number().nonnegative(),
  rows: z.number().int().min(1),
  columns: z.number().int().min(1),
  minDepth: z.number(),
  maxDepth: z.number(),
  flags: z.array(z_enumValueParser(ROOMF)).optional(),
  room: z.array(z.string().transform((str) => {
    return str.split('')
  })).refine(checkRoomCharacters, { message: 'invalid room character' })
}).refine(checkRoomDimensions, { message: 'invalid room dimensions' })

export type VaultJSON = z.input<typeof VaultSchema>
export type VaultParams = z.output<typeof VaultSchema>

export class Vault extends SerializableBase {
  static readonly schema = VaultSchema

  readonly name: string
  readonly type: RoomName
  readonly rating: number
  readonly height: number
  readonly width: number
  readonly minDepth: number
  readonly maxDepth: number
  readonly flags: Set<ROOMF>
  readonly room: Rectangle<string>

  constructor(params: VaultParams) {
    super(params)

    this.name = params.name
    this.type = params.type
    this.rating = params.rating
    this.height = params.rows
    this.width = params.columns
    this.minDepth = params.minDepth
    this.maxDepth = params.maxDepth
    this.flags = new Set(params.flags)
    this.room = new Rectangle(this.height, this.width, ({ x, y}) => {
      return params.room[y][x]
    })
  }

  register() {
    VaultRegistry.add(this.name, this)
  }

  toJSON(): VaultJSON {
    return {
      name: this.name,
      type: this.type,
      rating: this.rating,
      rows: this.height,
      columns: this.width,
      minDepth: this.minDepth,
      maxDepth: this.maxDepth,
      flags: enumValueSetToArray(this.flags, ROOMF),
      room: stringRectangleToRows(this.room),
    }
  }
}

export const VaultRegistry = new NameRegistry(Vault)
