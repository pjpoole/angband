import { box } from '../../common/core/loc'
import { randEl } from '../../common/core/rand'

import { DungeonProfileRegistry } from '../../common/game/registries'
import { Cave } from '../../common/world/cave'
import { Room } from '../../common/world/dungeonProfiles'
import {
  buildRandomRoom,
  buildRoom,
  isValidRoomName
} from '../../common/world/roomGenerators'

import { getObjects } from './testObjects'

export function getCave(roomName?: string, depth?: number): Cave {
  loadRooms()

  const [dungeon, cave] = getObjects(depth)

  const bpt = dungeon.roomMap!.box.center()

  let success = false
  let tries = 0
  while (!success && tries < 10) {
    const room = pickRoom(roomName)
    console.log('trying room...', room)
    tries++
    success = buildRoom(dungeon, cave, bpt, room, false)
  }

  return cave
}

export function getRandomRoom(roomName?: string, depth?: number) {
  const [dungeon, cave] = getObjects(depth)

  let success = false
  let tries = 0
  while (!success && tries < 10) {
    tries++
    success = composite(cave, roomName)
  }

  return cave
}

function composite(cave: Cave, roomName?: string): boolean {
  const chunk = buildRandomRoom(roomName)
  if (chunk == null) return false
  const b = box(0, 0, chunk.width - 1, chunk.height - 1)
  cave.composite(chunk, b)
  return true
}

let _loaded = false
const _rooms: Room[] = []

function loadRooms() {
  if (_loaded) return
  for (const profile of DungeonProfileRegistry) {
    _rooms.push(...profile.allowedRooms)
  }
}

function pickRoom(roomName?: string) {
  let rooms
  if (roomName && isValidRoomName(roomName)) {
    rooms = _rooms.filter((room) => room.name === roomName)
  } else {
    rooms = _rooms
  }
  return randEl(rooms)
}
