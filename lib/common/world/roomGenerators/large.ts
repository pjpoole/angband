import { Box, Loc } from '../../core/loc'
import { oneIn, randInt0, randInt1 } from '../../core/rand'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { FEAT } from '../features'
import { SQUARE } from '../square'

import { drawRectangle, fillRectangle } from './helpers/geometry'

export function build(
  dungeon: Dungeon,
  chunk: Cave,
  center: Loc,
  rating: number,
): boolean {
  const height = 9
  const width = 23

  const light = chunk.depth <= randInt1(25)

  if (!chunk.isInbounds(center)) {
    const newCenter = dungeon.findSpace(center.box(height + 2, width + 2))
    if (newCenter == null) return false
    center = newCenter
  }

  const b = center.box(height, width)

  chunk.generateBasicRoom(b, light)

  // inner room
  // Wall boundaries
  const innerWall = b.interior(1)
  drawRectangle(chunk, innerWall, FEAT.GRANITE, SQUARE.WALL_INNER)

  // Floor boundaries
  const innerFloor = innerWall.interior(1)

  switch(randInt1(5)) {
    case 1:
      // Inner room
      buildSimple(dungeon, chunk, innerFloor)
      break
    case 2:
      // Inner room with small inner room
      buildNested(dungeon, chunk, innerFloor)
      break
    case 3:
      // Inner room with pillars
      buildPillars(dungeon, chunk, innerFloor)
      break
    case 4:
      // Inner room with checkerboard
      buildCheckerboard(dungeon, chunk, innerFloor)
      break
    case 5:
      // Four small rooms
      buildQuad(dungeon, chunk, innerFloor)
      break
  }

  return true
}

function buildSimple(
  dungeon: Dungeon,
  chunk: Cave,
  b: Box,
) {
  chunk.generateHole(b.exterior(), FEAT.CLOSED)
  // TODO: Monsters
}

function buildNested(
  dungeon: Dungeon,
  chunk: Cave,
  b: Box,
) {
  chunk.generateHole(b.exterior(), FEAT.CLOSED)

  const nested = b.center().box(3)
  drawRectangle(chunk, nested, FEAT.GRANITE, SQUARE.WALL_INNER)
  chunk.generateHole(nested, FEAT.CLOSED)

  // TODO: find door on inner room and lock it
  //       Could use neighbors function

  // TODO: Monsters

  // Why not !oneIn(5) ?
  if (randInt0(100) < 80 || dungeon.persist) {
    // TODO: place object
  } else {
    // TODO: place stairs
  }

  // TODO: traps
}

function buildPillars(
  dungeon: Dungeon,
  chunk: Cave,
  b: Box,
) {
  const center = b.center()

  chunk.generateHole(b.exterior(), FEAT.CLOSED)

  // central pillar
  fillRectangle(chunk, center.box(3), FEAT.GRANITE, SQUARE.WALL_INNER)

  if (oneIn(2)) {
    // Occasionally, two more large pillars
    if (oneIn(2)) {
      fillRectangle(chunk, center.trX(-6).box(3), FEAT.GRANITE, SQUARE.WALL_INNER)
      fillRectangle(chunk, center.trX(6).box(3), FEAT.GRANITE, SQUARE.WALL_INNER)
    } else {
      fillRectangle(chunk, center.trX(-5).box(3), FEAT.GRANITE, SQUARE.WALL_INNER)
      fillRectangle(chunk, center.trX(5).box(3), FEAT.GRANITE, SQUARE.WALL_INNER)
    }
  }

  if (oneIn(3)) {
    // Inner rectangle
    drawRectangle(chunk, center.box(3, 11), FEAT.GRANITE, SQUARE.WALL_INNER)

    chunk.placeSecretDoor(center.tr(-3, oneIn(2) ? -1 : 1))
    chunk.placeSecretDoor(center.tr(3, oneIn(2) ? -1 : 1))

    // TODO: monsters

    // TODO: objects
  }
}

function buildCheckerboard(
  dungeon: Dungeon,
  chunk: Cave,
  b: Box,
) {
  chunk.generateHole(b.exterior(), FEAT.CLOSED)

  for (const pt of b) {
    if (((pt.x + pt.y) & 1) !== 0) chunk.setMarkedGranite(pt, SQUARE.WALL_INNER)
  }

  // TODO: monsters
  // TODO: traps
  // TODO: objects
}

function buildQuad(
  dungeon: Dungeon,
  chunk: Cave,
  b: Box,
) {
  const center = b.center()
  chunk.generatePlus(b, FEAT.GRANITE, SQUARE.WALL_INNER)

  if (oneIn(2)) {
    const i = randInt1(10)
    chunk.placeClosedDoor(center.tr(i * -1, -1))
    chunk.placeClosedDoor(center.tr(i, -1))
    chunk.placeClosedDoor(center.tr(i * -1, 1))
    chunk.placeClosedDoor(center.tr(i, 1))

  } else {
    const i = randInt1(3)
    chunk.placeClosedDoor(center.tr(-1, i))
    chunk.placeClosedDoor(center.tr(-1, i * -1))
    chunk.placeClosedDoor(center.tr(1, i))
    chunk.placeClosedDoor(center.tr(1, i * -1))
  }

  // TODO: object

  // TODO: Monsters
}
