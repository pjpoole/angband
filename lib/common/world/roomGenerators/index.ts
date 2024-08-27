import { getConstants } from '../../core/loading'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { Room } from '../dungeonProfiles'

import { build as buildCircular } from './circular'
import { build as buildCrossed } from './crossed'
import { build as buildGreaterVault } from './greaterVault'
import { build as buildGreaterVaultNew } from './greaterVaultNew'
import { build as buildHuge } from './huge'
import { build as buildInteresting } from './interesting'
import { build as buildLarge } from './large'
import { build as buildLesserVault } from './lesserVault'
import { build as buildLesserVaultNew } from './lesserVaultNew'
import { build as buildMediumVault } from './mediumVault'
import { build as buildMediumVaultNew } from './mediumVaultNew'
import { build as buildMoria } from './moria'
import { build as buildNest } from './nest'
import { build as buildOverlap } from './overlap'
import { build as buildPit } from './pit'
import { build as buildRoomOfChambers } from './roomOfChambers'
import { build as buildSimple } from './simple'
import { build as buildStaircase } from './staircase'
import { build as buildTemplate } from './template'

type RoomBuilder = (
  dungeon: Dungeon,
  chunk: Cave,
  x: number,
  y: number,
  rating: number,
) => boolean

interface RoomEntry {
  name: string
  rows: number
  cols: number
  fn: RoomBuilder
}

// list-rooms.h
const ROOM: RoomEntry[] = [
  { name: 'staircase room', rows: 0, cols: 0, fn: buildStaircase },
  { name: 'simple room', rows: 0, cols: 0, fn: buildSimple },
  { name: 'moria room', rows: 0, cols: 0, fn: buildMoria },
  { name: 'large room', rows: 0, cols: 0, fn: buildLarge },
  { name: 'crossed room', rows: 0, cols: 0, fn: buildCrossed },
  { name: 'circular room', rows: 0, cols: 0, fn: buildCircular },
  { name: 'overlap room', rows: 0, cols: 0, fn: buildOverlap },
  { name: 'room template', rows: 11, cols: 33, fn: buildTemplate },
  { name: 'Interesting room', rows: 40, cols: 50, fn: buildInteresting },
  { name: 'monster pit', rows: 0, cols: 0, fn: buildPit },
  { name: 'monster nest', rows: 0, cols: 0, fn: buildNest },
  { name: 'huge room', rows: 0, cols: 0, fn: buildHuge },
  { name: 'room of chambers', rows: 0, cols: 0, fn: buildRoomOfChambers },
  { name: 'Lesser vault', rows: 22, cols: 22, fn: buildLesserVault },
  { name: 'Medium vault', rows: 22, cols: 33, fn: buildMediumVault },
  { name: 'Greater vault', rows: 44, cols: 66, fn: buildGreaterVault },
  { name: 'Lesser vault (new)', rows: 22, cols: 22, fn: buildLesserVaultNew },
  { name: 'Medium vault (new)', rows: 22, cols: 33, fn: buildMediumVaultNew },
  { name: 'Greater vault (new)', rows: 44, cols: 66, fn: buildGreaterVaultNew },
]

export function buildRoom(
  dungeon: Dungeon,
  chunk: Cave,
  bx0: number,
  by0: number,
  profile: Room,
  findsOwnSpace: boolean
): boolean {
  if (chunk.depth < profile.level) return false
  if (profile.pit && dungeon.numPits >= getConstants().dungeonGeneration.pitMax) return false

  let bx1 = bx0
  let by1 = by0
  let bx2 = bx0 + Math.ceil(profile.width / dungeon.blockWidth)
  let by2 = by0 + Math.ceil(profile.height / dungeon.blockHeight)

  const builder = findBuilder(profile.name)

  if (findsOwnSpace) {
    if (!builder(dungeon, chunk, chunk.width, chunk.height, profile.rating)) {
      return false
    }
  } else {
    if (!dungeon.checkForUnreservedBlocks(bx1, by1, bx2, by2)) {
      return false
    }

    const centerX = Math.trunc((bx1 + bx2 + 1) * dungeon.blockWidth / 2)
    const centerY = Math.trunc((by1 + by2 + 1) * dungeon.blockHeight / 2)

    // per C comments, this has to be available in the dungeon for proper
    // entrance calculation
    dungeon.addCenter(centerX, centerY)

    if (!builder(dungeon, chunk, centerX, centerY, profile.rating)) {
      // TODO: figure out if we can simply put this in the builder
      dungeon.popCenter()
      return false
    }

    dungeon.reserveBlocks(bx1, by1, bx2, by2)
  }

  if (profile.pit) dungeon.numPits++

  // TODO: remove before flight
  return true
}

export function isValidRoomName(name: string): boolean {
  for (const room of ROOM) {
    if (room.name === name) return true
  }

  return false
}

function findBuilder(name: string): RoomBuilder {
  for (const room of ROOM) {
    if (room.name === name) {
      return room.fn
    }
  }

  throw new Error('invalid room name')
}
