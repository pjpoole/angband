import { randInt0 } from '../../common/core/rand'
import { DungeonProfileRegistry } from '../../common/game/registries'
import { isQuest } from '../../common/game/quest'

import { Dungeon } from '../../common/world/dungeon'
import { DUN } from '../../common/world/dungeonTypes'

import { BirthOptions, Player } from '../../common/player/player'

import { Cave } from '../../common/world/cave'
import { Room } from '../../common/world/dungeonProfiles'
import { FEAT } from '../../common/world/features'
import { buildRoom, isValidRoomName } from '../../common/world/roomGenerators'
import { SQUARE } from '../../common/world/square'

export function getCave(roomName?: string, depth?: number): Cave {
  loadRooms()
  // const roomName = getTemplate(params.roomName)

  const player = buildPlayer()
  player.depth = depth ?? 50

  const dungeon = buildDungeon(player)

  const cave = new Cave({
    height: 100,
    width: 200,
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
