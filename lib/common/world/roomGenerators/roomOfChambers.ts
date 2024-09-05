import { Box, box, loc, Loc } from '../../core/loc'
import { mBonus, oneIn, randInRange, randInt0, randInt1 } from '../../core/rand'
import { getAllNeighbors, M_NP_XY } from '../../utilities/directions'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { FEAT } from '../features'
import { SQUARE } from '../square'

import { placeRandomDoor } from './helpers/door'
import { drawFilledRectangle } from './helpers/geometry'
import { hollowRoom } from './helpers/room'
import { DimensionGeneratingParams, RoomGeneratorBase } from './RoomGenerator'

export function build(
  dungeon: Dungeon,
  cave: Cave,
  center: Loc,
  rating: number, // not used
): boolean {
  const generator = new RoomOfChambersGenerator({ depth: cave.depth })
  return generator.draw(dungeon, cave, center)
}

export function buildRoom(): Cave | null {
  const depth = randInt1(100)
  const generator = new RoomOfChambersGenerator({ depth })
  return generator.build()
}

export class RoomOfChambersGenerator extends RoomGeneratorBase {
  constructor(params: DimensionGeneratingParams) {
    const depth = params.depth
    const height = 24 + mBonus(20, depth)
    const width = 24 + randInt1(20) + mBonus(20, depth)

    super({ height, width, depth, padding: 0 })
  }

  protected getNewCave(): Cave {
    return new Cave({
      height: this.height,
      width: this.width,
      depth: this.depth,
      fill: FEAT.GRANITE,
    })
  }

  // TODO: This has probably drifted from how the original is implemented
  // TODO: Exterior / interior wall marking is a bit dodgy
  build(): Cave | null {
    const chunk = this.getNewCave()
    const exterior = chunk.box
    const interior = exterior.interior(2)

    const area = interior.size

    const countChambers = 10 + Math.trunc(area / 80)

    for (let i = 0; i < countChambers; i++) {
      makeChamber(chunk, getRandomBox(interior))
    }

    cleanUpChambers(chunk, interior)

    const startingPoint = findMagma(chunk, interior)

    const tile = chunk.get(startingPoint)
    chunk.setFeature(tile, FEAT.FLOOR)
    hollowRoom(chunk, startingPoint)

    convertMagmaToFloor(chunk, interior)
    replaceTempDoors(chunk, interior)

    cleanUpRooms(chunk, exterior)
    markOuterWalls(chunk, exterior)

    // TODO: monsters

    return chunk
  }
}

// Build the chambers.
function makeChamber(chunk: Cave, b: Box) {
  drawFilledRectangle(chunk, b.interior(), FEAT.MAGMA, SQUARE.NONE)

  for (const pt of b.borders()) {
    makeInnerChamberWall(chunk, pt)
  }

  // Try to make a door
  let tries = 0
  let success = false

  while (tries < 20 && !success) {
    tries++
    success = tryDrawRandomDoor(chunk, b)
  }
}

// Remove useless doors, fill in tiny, narrow rooms.
function cleanUpChambers(chunk: Cave, b: Box) {
  for (const p of b) {
    if (!chunk.isFullyInbounds(p)) continue

    let count = 0

    for (const p1 of getAllNeighbors(p)) {
      const t1 = chunk.get(p1)
      if (
        t1.is(FEAT.GRANITE) &&
        !t1.isWallOuter() &&
        !t1.isWallSolid()
      ) count++
    }
    const tile = chunk.get(p)
    if (count === 5 && !tile.is(FEAT.MAGMA)) {
      chunk.setMarkedGranite(p, SQUARE.WALL_INNER)
    } else if (count > 5) {
      chunk.setMarkedGranite(p, SQUARE.WALL_INNER)
    }
  }
}

// Pick a random magma spot near the center of the room.
function findMagma(chunk: Cave, b: Box): Loc {
  const { left, top, right, bottom } = b
  let p1: Loc | undefined
  // TODO: this could be made deterministic
  for (let i = 0; i < 50; i++) {
    p1 = loc(
      left + Math.trunc(right / 4) + randInt0(Math.trunc(right / 2)),
      top + Math.trunc(bottom / 4) + randInt0(Math.trunc(bottom / 2))
    )
    if (chunk.get(p1).is(FEAT.MAGMA)) break
  }
  // sacrifice to the typescript gods
  if (p1 == null) throw new Error('no point selected')

  return p1
}

// Attempt to change every in-room magma grid to open floor.
function convertMagmaToFloor(chunk: Cave, b: Box) {
  for (let i = 0; i < 100; i++) {
    let joy = false

    // make new doors and tunnels between magma and open floor
    for (const p of b) {
      if (!chunk.isFullyInbounds(p)) continue

      const t = chunk.get(p)
      if (!t.is(FEAT.MAGMA)) continue

      for (let d = 0; d < 4; d++) {
        const [x, y] = M_NP_XY[d]
        const p1 = p.tr(x, y)

        const t1 = chunk.get(p1)
        if (!t1.isWallInner()) continue

        const p2 = p1.tr(x, y)
        if (!chunk.isInbounds(p2)) continue

        const t2 = chunk.get(p2)
        // if we find open floor, place a door
        if (t2.is(FEAT.FLOOR)) {
          joy = true

          chunk.setFeature(t1, FEAT.BROKEN)
          chunk.setFeature(t, FEAT.FLOOR)

          hollowRoom(chunk, p)
          break
        }

        // if we find more inner wall,
        if (!t2.isWallInner()) continue

        const p3 = p2.tr(x, y)
        if (!chunk.isInbounds(p3)) continue

        const t3 = chunk.get(p3)
        if (t3.is(FEAT.FLOOR)) {
          joy = true

          chunk.setFeature(t1, FEAT.FLOOR)
          chunk.setFeature(t2, FEAT.FLOOR)

          chunk.setFeature(t, FEAT.FLOOR)
          hollowRoom(chunk, p)
          break
        }

      }
    }

    if (!joy) break
  }
}

// Turn broken doors into a random kind of door, remove open doors.
function replaceTempDoors(chunk: Cave, b: Box) {
  for (const p of b) {
    const tile = chunk.get(p)
    if (tile.is(FEAT.OPEN)) {
      chunk.setMarkedGranite(p, SQUARE.WALL_INNER)
    } else if (tile.is(FEAT.BROKEN)) {
      placeRandomDoor(chunk, p)
    }
  }
}

function cleanUpRooms(chunk: Cave, b: Box) {
  const light = chunk.depth < randInt0(45)

  // Turn all walls and magma not adjacent to floor into dungeon granite.
  for (const p of b) {
    const tile = chunk.get(p)

    if (tile.isWallInner() || tile.is(FEAT.MAGMA)) {
      for (let i = 0; i < 9; i++) {
        const p1 = p.tr(...M_NP_XY[i])
        if (!chunk.isInbounds(p1)) continue
        const tile1 = chunk.get(p1)
        if (tile1.is(FEAT.FLOOR)) break
        if (i === 8) {
          chunk.setMarkedGranite(p, SQUARE.NONE)
        }
      }
    }

    // Turn all floors and adjacent grids into rooms, sometimes lighting them.
    if (tile.isFloor()) {
      for (let i = 0; i < 9; i++) {
        const p1 = p.tr(...M_NP_XY[i])
        if (!chunk.isInbounds(p1)) continue
        const tile1 = chunk.get(p1)
        tile1.turnOn(SQUARE.ROOM)
        tile1.turnOn(SQUARE.NO_STAIRS)

        if (light) tile.turnOn(SQUARE.GLOW)
      }
    }
  }
}

// Turn all inner wall grids adjacent to dungeon granite into outer walls
function markOuterWalls(chunk: Cave, b: Box) {
  for (const p of b) {
    if (!chunk.isFullyInbounds(p)) continue

    const t = chunk.get(p)

    if (t.isWallInner()) {
      for (let i = 0; i < 9; i++) {
        const p1 = p.tr(...M_NP_XY[i])
        const t1 = chunk.get(p1)

        if (
          t1.is(FEAT.GRANITE) &&
          !t.isWallInner() &&
          !t.isWallOuter() &&
          !t.isWallSolid()
        ) {
          chunk.setMarkedGranite(p, SQUARE.WALL_OUTER)
          break
        }
      }
    }
  }
}

function getRandomBox(b: Box): Box {
  const size = randInRange(3, 7)
  const roomWidth = size + randInt0(10)
  const roomHeight = size + randInt0(4)

  const top = b.top + randInt0(1 + b.bottom - b.top - roomHeight)
  const left = b.left + randInt0(1 + b.right - b.left - roomWidth)

  const bottom = Math.min(top + roomHeight, b.bottom)
  const right = Math.min(left + roomWidth, b.right)

  return box(left, top, right, bottom)
}

function tryDrawRandomDoor(chunk: Cave, b: Box): boolean {
  const p1 = pickDoorLocation(b)

  if (!chunk.isFullyInbounds(p1)) return false
  if (!chunk.get(p1).isWallInner()) return false

  let innerWalls = 0
  let tiles = 0
  for (const p2 of getAllNeighbors(p1, true)) {
    tiles++
    const tile = chunk.get(p2)
    if (tile.is(FEAT.OPEN)) break
    if (tile.isWallInner()) innerWalls++
    if (innerWalls > 3) break
    if (tiles === 9) {
      chunk.setFeature(tile, FEAT.OPEN)
      return true
    }
  }
  return false
}

function pickDoorLocation(b: Box): Loc {
  if (oneIn(2)) {
    return loc(
      oneIn(2) ? b.left : b.right,
      b.top + randInt0(1 + b.height - 1)
    )
  } else {
    return loc(
      b.left + randInt0(1 + b.width - 1),
      oneIn(2) ? b.top : b.bottom
    )
  }
}

function makeInnerChamberWall(chunk: Cave, p: Loc) {
  const tile = chunk.get(p)
  if (!tile.is(FEAT.GRANITE) && !tile.is(FEAT.MAGMA)) return
  if (tile.isWallOuter()) return
  if (tile.isWallSolid()) return
  chunk.setMarkedGranite(p, SQUARE.WALL_INNER)
}
