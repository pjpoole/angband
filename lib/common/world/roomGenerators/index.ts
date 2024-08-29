import { Coord } from '../../core/coordinate'
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
  pt: Coord,
  rating: number,
) => boolean

export type RoomName = 'Greater vault (new)' | 'Greater vault' | 'Interesting room'
  | 'Lesser vault (new)' | 'Lesser vault' | 'Medium vault (new)'
  | 'Medium vault' | 'circular room' | 'crossed room' | 'huge room'
  | 'large room' | 'monster nest' | 'monster pit' | 'moria room'
  | 'overlap room' | 'room of chambers' | 'room template' | 'simple room'
  | 'staircase room'

interface RoomEntry {
  name: RoomName
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
  bpt: Coord,
  profile: Room,
  findsOwnSpace: boolean
): boolean {
  if (chunk.depth < profile.level) return false
  if (profile.pit && dungeon.numPits >= getConstants().dungeonGeneration.pitMax) return false

  const { x: bx0, y: by0 } = bpt
  const bp1 = { ...bpt }
  const bp2 = {
    x: bx0 + Math.ceil(profile.width / dungeon.blockWidth),
    y: by0 + Math.ceil(profile.height / dungeon.blockHeight)
  }

  const builder = findBuilder(profile.name)

  if (findsOwnSpace) {
    if (!builder(dungeon, chunk, { x: chunk.width, y: chunk.height }, profile.rating)) {
      return false
    }
  } else {
    if (!dungeon.checkForUnreservedBlocks(bp1, bp2)) {
      return false
    }

    // actual point, not block point
    const center = {
      x: Math.trunc((bp1.x + bp2.x + 1) * dungeon.blockWidth / 2),
      y: Math.trunc((bp1.y + bp2.y + 1) * dungeon.blockHeight / 2)
    }

    // per C comments, this has to be available in the dungeon for proper
    // entrance calculation
    dungeon.addCenter(center)

    if (!builder(dungeon, chunk, center, profile.rating)) {
      // TODO: figure out if we can simply put this in the builder
      dungeon.popCenter()
      return false
    }

    dungeon.reserveBlocks(bp1, bp2)
  }

  if (profile.pit) dungeon.numPits++

  // TODO: remove before flight
  return true
}

export function isValidRoomName(name: string): name is RoomName {
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
