import { Box, Loc } from '../../core/loc'
import { oneIn, randInt0, randInt1 } from '../../core/rand'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { FEAT } from '../features'
import { SQUARE } from '../square'

import { placeClosedDoor, placeSecretDoor } from './helpers/door'
import {
  drawPlus,
  drawRectangle,
  drawFilledRectangle,
  drawRandomHole
} from './helpers/geometry'
import { generateBasicRoom } from './helpers/room'
import { DimensionGeneratingParams, RoomGeneratorBase } from './RoomGenerator'

export function build(
  dungeon: Dungeon,
  cave: Cave,
  center: Loc,
  rating: number, // not used
): boolean {
  const generator = new LargeRoomGenerator({ depth: cave.depth })
  return generator.draw(dungeon, cave, center)
}

export function buildRoom(): Cave | null {
  const depth = randInt1(100)
  const generator = new LargeRoomGenerator({ depth })
  return generator.build()
}

export class LargeRoomGenerator extends RoomGeneratorBase {
  constructor(params: DimensionGeneratingParams) {
    super(Object.assign({ height: 9, width: 23}, params))
  }

  build(): Cave {
    const chunk = this.getNewCave()

    const b = chunk.box

    const light = chunk.depth <= randInt1(25)
    generateBasicRoom(chunk, b, light)

    // inner room
    // Wall boundaries
    const innerWall = b.interior(1)
    drawRectangle(chunk, innerWall, FEAT.GRANITE, SQUARE.WALL_INNER)

    // Floor boundaries
    const innerFloor = innerWall.interior(1)

    switch (randInt1(5)) {
      case 1:
        // Inner room
        buildSimple(chunk, innerFloor)
        break
      case 2:
        // Inner room with small inner room
        buildNested(chunk, innerFloor)
        break
      case 3:
        // Inner room with pillars
        buildPillars(chunk, innerFloor)
        break
      case 4:
        // Inner room with checkerboard
        buildCheckerboard(chunk, innerFloor)
        break
      case 5:
        // Four small rooms
        buildQuad(chunk, innerFloor)
        break
    }

    return chunk
  }
}

function buildSimple(
  chunk: Cave,
  b: Box,
) {
  drawRandomHole(chunk, b.exterior(), FEAT.CLOSED)
  // TODO: Monsters
}

function buildNested(
  chunk: Cave,
  b: Box,
) {
  drawRandomHole(chunk, b.exterior(), FEAT.CLOSED)

  const nested = b.center().box(3)
  drawRectangle(chunk, nested, FEAT.GRANITE, SQUARE.WALL_INNER)
  drawRandomHole(chunk, nested, FEAT.CLOSED)

  // TODO: find door on inner room and lock it
  //       Could use neighbors function

  // TODO: Monsters

  // Why not !oneIn(5) ?
  // TODO: dungeon.persist
  if (randInt0(100) < 80) {
    // TODO: place object
  } else {
    // TODO: place stairs
  }

  // TODO: traps
}

function buildPillars(
  chunk: Cave,
  b: Box,
) {
  const center = b.center()

  drawRandomHole(chunk, b.exterior(), FEAT.CLOSED)

  // central pillar
  drawFilledRectangle(chunk, center.box(3), FEAT.GRANITE, SQUARE.WALL_INNER)

  if (oneIn(2)) {
    // Occasionally, two more large pillars
    if (oneIn(2)) {
      drawFilledRectangle(chunk, center.trX(-6).box(3), FEAT.GRANITE, SQUARE.WALL_INNER)
      drawFilledRectangle(chunk, center.trX(6).box(3), FEAT.GRANITE, SQUARE.WALL_INNER)
    } else {
      drawFilledRectangle(chunk, center.trX(-5).box(3), FEAT.GRANITE, SQUARE.WALL_INNER)
      drawFilledRectangle(chunk, center.trX(5).box(3), FEAT.GRANITE, SQUARE.WALL_INNER)
    }
  }

  if (oneIn(3)) {
    // Inner rectangle
    drawRectangle(chunk, center.box(3, 11), FEAT.GRANITE, SQUARE.WALL_INNER)

    placeSecretDoor(chunk, center.tr(-3, oneIn(2) ? -1 : 1))
    placeSecretDoor(chunk, center.tr(3, oneIn(2) ? -1 : 1))

    // TODO: monsters

    // TODO: objects
  }
}

function buildCheckerboard(
  chunk: Cave,
  b: Box,
) {
  drawRandomHole(chunk, b.exterior(), FEAT.CLOSED)

  for (const pt of b) {
    if (((pt.x + pt.y) & 1) !== 0) chunk.setMarkedGranite(pt, SQUARE.WALL_INNER)
  }

  // TODO: monsters
  // TODO: traps
  // TODO: objects
}

function buildQuad(
  chunk: Cave,
  b: Box,
) {
  const center = b.center()
  drawPlus(chunk, b, FEAT.GRANITE, SQUARE.WALL_INNER)

  if (oneIn(2)) {
    const i = randInt1(10)
    placeClosedDoor(chunk, center.tr(i * -1, -1))
    placeClosedDoor(chunk, center.tr(i, -1))
    placeClosedDoor(chunk, center.tr(i * -1, 1))
    placeClosedDoor(chunk, center.tr(i, 1))

  } else {
    const i = randInt1(3)
    placeClosedDoor(chunk, center.tr(-1, i))
    placeClosedDoor(chunk, center.tr(-1, i * -1))
    placeClosedDoor(chunk, center.tr(1, i))
    placeClosedDoor(chunk, center.tr(1, i * -1))
  }

  // TODO: object

  // TODO: Monsters
}
