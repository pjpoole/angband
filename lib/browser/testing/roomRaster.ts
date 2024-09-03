import { box } from '../../common/core/loc'
import { randInt0 } from '../../common/core/rand'

import { DungeonProfileRegistry } from '../../common/game/registries'
import { isQuest } from '../../common/game/quest'
import { BirthOptions, Player } from '../../common/player/player'
import { Cave } from '../../common/world/cave'
import { Dungeon } from '../../common/world/dungeon'
import { Room } from '../../common/world/dungeonProfiles'
import { DUN } from '../../common/world/dungeonTypes'
import { FEAT } from '../../common/world/features'
import {
  buildRandomRoom,
  buildRoom,
  isValidRoomName
} from '../../common/world/roomGenerators'
import { SQUARE } from '../../common/world/square'

export function getCave(roomName?: string, depth?: number): Cave {
  loadRooms()
  // const roomName = getTemplate(params.roomName)

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

function getObjects(depth?: number): [Dungeon, Cave, Player] {
  const player = buildPlayer()
  player.depth = depth ?? 50

  const dungeon = buildDungeon(player)

  const cave = new Cave({
    height: 50,
    width: 100,
    depth: player.depth,
    fill: FEAT.GRANITE,
    flag: SQUARE.NONE,
  })

  dungeon.blockHeight = dungeon.profile.blockSize
  dungeon.blockWidth = dungeon.profile.blockSize
  const blockRows = Math.trunc(cave.height / dungeon.blockHeight)
  const blockColumns = Math.trunc(cave.width / dungeon.blockWidth)
  dungeon.blockRows = blockRows
  dungeon.blockColumns = blockColumns

  return [dungeon, cave, player]
}

export function getRandomRoom(depth?: number) {
  const [dungeon, cave] = getObjects(depth)

  let success = false
  let tries = 0
  while (!success && tries < 10) {
    tries++
    success = composite(cave)
  }

  return cave
}

function composite(cave: Cave): boolean {
  const chunk = buildRandomRoom()
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
  return rooms[randInt0(rooms.length)]
}

function buildDungeon(player: Player) {
  return new Dungeon({
    profile: DungeonProfileRegistry.get(DUN.classic),
    persist: player.options.birth.levelsPersist,
    quest: isQuest(player, player.depth),
  })
}

function buildPlayer() {
  return new Player(getPlayerParams())
}

function getPlayerParams() {
  return {
    options: {
      birth: new BirthOptions({})
    }
  }
}
