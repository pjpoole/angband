import { loc, Loc, locIterate, toExteriorBox } from '../../core/loc'
import { oneIn, randInt0, randInt1 } from '../../core/rand'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { FEAT } from '../features'
import { SQUARE } from '../square'

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
    if (!dungeon.findSpace(center, height + 2, width + 2)) return false
  }

  const [upperLeft, lowerRight] = center.boxCorners(height, width)
  chunk.generateBasicRoom(upperLeft, lowerRight, light)

  // inner room
  // Wall boundaries
  const iwUpperLeft = upperLeft.offset(1)
  const iwLowerRight = lowerRight.offset(-1)
  chunk.drawRectangle(iwUpperLeft, iwLowerRight, FEAT.GRANITE, SQUARE.WALL_INNER, false)

  // Floor boundaries
  const irUpperLeft = iwUpperLeft.offset(1)
  const irLowerRight = iwLowerRight.offset(-1)

  switch(randInt1(5)) {
    case 1:
      // Inner room
      buildSimple(dungeon, chunk, center, irUpperLeft, irLowerRight)
      break
    case 2:
      // Inner room with small inner room
      buildNested(dungeon, chunk, center, irUpperLeft, irLowerRight)
      break
    case 3:
      // Inner room with pillars
      buildPillars(dungeon, chunk, center, irUpperLeft, irLowerRight)
      break
    case 4:
      // Inner room with checkerboard
      buildCheckerboard(dungeon, chunk, center, irUpperLeft, irLowerRight)
      break
    case 5:
      // Four small rooms
      buildQuad(dungeon, chunk, center, irUpperLeft, irLowerRight)
      break
  }

  return true
}

function buildSimple(
  dungeon: Dungeon,
  chunk: Cave,
  center: Loc,
  upperLeft: Loc,
  lowerRight: Loc,
) {
  chunk.generateHole(...toExteriorBox(upperLeft, lowerRight), FEAT.CLOSED)
  // TODO: Monsters
}

function buildNested(
  dungeon: Dungeon,
  chunk: Cave,
  center: Loc,
  upperLeft: Loc,
  lowerRight: Loc,
) {
  chunk.generateHole(...toExteriorBox(upperLeft, lowerRight), FEAT.CLOSED)

  const [crUL, crLR] = center.boxToRadius(1)
  chunk.drawRectangle(crUL, crLR, FEAT.GRANITE, SQUARE.WALL_INNER, false)
  chunk.generateHole(crUL, crLR, FEAT.CLOSED)

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
  center: Loc,
  upperLeft: Loc,
  lowerRight: Loc,
) {
  chunk.generateHole(...toExteriorBox(upperLeft, lowerRight), FEAT.CLOSED)

  // central pillar
  chunk.fillRectangle(...center.boxCorners(3), FEAT.GRANITE, SQUARE.WALL_INNER)

  if (oneIn(2)) {
    // Occasionally, two more large pillars
    if (oneIn(2)) {
      chunk.fillRectangle(
        ...center.trX(-6).boxCorners(3),
        FEAT.GRANITE,
        SQUARE.WALL_INNER,
      )

      chunk.fillRectangle(
        ...center.trX(6).boxCorners(3),
        FEAT.GRANITE,
        SQUARE.WALL_INNER,
      )
    } else {
      chunk.fillRectangle(
        ...center.trX(-5).boxCorners(3),
        FEAT.GRANITE,
        SQUARE.WALL_INNER,
      )

      chunk.fillRectangle(
        ...center.trX(5).boxCorners(3),
        FEAT.GRANITE,
        SQUARE.WALL_INNER,
      )
    }
  }

  if (oneIn(3)) {
    // Inner rectangle
    chunk.drawRectangle(
      ...center.boxCorners(3, 11),
      FEAT.GRANITE,
      SQUARE.WALL_INNER,
      false
    )

    chunk.placeSecretDoor(center.tr(-3, -3 + (randInt1(2) * 2)))
    chunk.placeSecretDoor(center.tr(3, -3 + (randInt1(2) * 2)))

    // TODO: monsters

    // TODO: objects
  }
}

function buildCheckerboard(
  dungeon: Dungeon,
  chunk: Cave,
  center: Loc,
  upperLeft: Loc,
  lowerRight: Loc,
) {
  chunk.generateHole(...toExteriorBox(upperLeft, lowerRight), FEAT.CLOSED)

  for (const pt of locIterate(upperLeft, lowerRight)) {
    if (((pt.x + pt.y) & 1) !== 0) chunk.setMarkedGranite(pt, SQUARE.WALL_INNER)
  }

  // TODO: monsters
  // TODO: traps
  // TODO: objects
}

function buildQuad(
  dungeon: Dungeon,
  chunk: Cave,
  center: Loc,
  upperLeft: Loc,
  lowerRight: Loc,
) {
  chunk.generatePlus(upperLeft, lowerRight, FEAT.GRANITE, SQUARE.WALL_INNER)

  if (oneIn(2)) {
    const i = randInt1(10)
    chunk.placeClosedDoor(loc(center.x - i, upperLeft.y - 1))
    chunk.placeClosedDoor(loc(center.x + i, upperLeft.y - 1))
    chunk.placeClosedDoor(loc(center.x - i, lowerRight.y + 1))
    chunk.placeClosedDoor(loc(center.x + i, lowerRight.y + 1))
  } else {
    const i = randInt1(3)
    chunk.placeClosedDoor(loc(upperLeft.x - 1, center.y + i))
    chunk.placeClosedDoor(loc(upperLeft.x - 1, center.y - i))
    chunk.placeClosedDoor(loc(lowerRight.x + 1, center.y + i))
    chunk.placeClosedDoor(loc(lowerRight.x + 1, center.y - i))
  }

  // TODO: object

  // TODO: Monsters
}
