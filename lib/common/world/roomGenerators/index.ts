// list-rooms.h
import { Dungeon } from '../dungeon'
import { Cave } from '../cave'
import { Room } from '../dungeonProfiles'
import { getConstants } from '../../core/loading'

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
  { name: 'Lesser vault (new)', rows: 22, cols: 22, fn: buildLesserNewVault },
  { name: 'Medium vault (new)', rows: 22, cols: 33, fn: buildMediumNewVault },
  { name: 'Greater vault (new)', rows: 44, cols: 66, fn: buildGreaterNewVault },
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
  }

  // TODO: remove before flight
  return false
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

function buildStaircase(
  dungeon: Dungeon,
  chunk: Cave,
  x: number,
  y: number,
  rating: number,
): boolean {
  return false
}

function buildSimple(
  dungeon: Dungeon,
  chunk: Cave,
  x: number,
  y: number,
  rating: number,
): boolean {
  return false
}

function buildMoria(
  dungeon: Dungeon,
  chunk: Cave,
  x: number,
  y: number,
  rating: number,
): boolean {
  return false
}

function buildLarge(
  dungeon: Dungeon,
  chunk: Cave,
  x: number,
  y: number,
  rating: number,
): boolean {
  return false
}

function buildCrossed(
  dungeon: Dungeon,
  chunk: Cave,
  x: number,
  y: number,
  rating: number,
): boolean {
  return false
}

function buildCircular(
  dungeon: Dungeon,
  chunk: Cave,
  x: number,
  y: number,
  rating: number,
): boolean {
  return false
}

function buildOverlap(
  dungeon: Dungeon,
  chunk: Cave,
  x: number,
  y: number,
  rating: number,
): boolean {
  return false
}

function buildTemplate(
  dungeon: Dungeon,
  chunk: Cave,
  x: number,
  y: number,
  rating: number,
): boolean {
  return false
}

function buildInteresting(
  dungeon: Dungeon,
  chunk: Cave,
  x: number,
  y: number,
  rating: number,
): boolean {
  return false
}

function buildPit(
  dungeon: Dungeon,
  chunk: Cave,
  x: number,
  y: number,
  rating: number,
): boolean {
  return false
}

function buildNest(
  dungeon: Dungeon,
  chunk: Cave,
  x: number,
  y: number,
  rating: number,
): boolean {
  return false
}

function buildHuge(
  dungeon: Dungeon,
  chunk: Cave,
  x: number,
  y: number,
  rating: number,
): boolean {
  return false
}

function buildRoomOfChambers(
  dungeon: Dungeon,
  chunk: Cave,
  x: number,
  y: number,
  rating: number,
): boolean {
  return false
}

function buildLesserVault(
  dungeon: Dungeon,
  chunk: Cave,
  x: number,
  y: number,
  rating: number,
): boolean {
  return false
}

function buildMediumVault(
  dungeon: Dungeon,
  chunk: Cave,
  x: number,
  y: number,
  rating: number,
): boolean {
  return false
}

function buildGreaterVault(
  dungeon: Dungeon,
  chunk: Cave,
  x: number,
  y: number,
  rating: number,
): boolean {
  return false
}

function buildLesserNewVault(
  dungeon: Dungeon,
  chunk: Cave,
  x: number,
  y: number,
  rating: number,
): boolean {
  return false
}

function buildMediumNewVault(
  dungeon: Dungeon,
  chunk: Cave,
  x: number,
  y: number,
  rating: number,
): boolean {
  return false
}

function buildGreaterNewVault(
  dungeon: Dungeon,
  chunk: Cave,
  x: number,
  y: number,
  rating: number,
): boolean {
  return false
}
