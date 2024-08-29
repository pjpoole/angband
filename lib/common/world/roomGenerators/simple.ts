import { loc, Loc } from '../../core/loc'
import { oneIn, randInt0, randInt1 } from '../../core/rand'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { SQUARE } from '../square'

export function build(
  dungeon: Dungeon,
  chunk: Cave,
  center: Loc,
  rating: number, // not used
): boolean {
  const height = 1 + randInt1(4) + randInt1(3) // 3-8
  const width = 1 + randInt1(11) + randInt1(11) // 3-23

  if (!chunk.isInbounds(center)) {
    if (!dungeon.findSpace(center, height + 2, width + 2)) return false
  }

  const light = chunk.depth <= randInt1(25)

  // wall boundaries
  const [topLeft, bottomRight] = center.boxCorners(height, width)
  chunk.generateBasicRoom(topLeft, bottomRight, light)

  if (oneIn(20)) {
    // sometimes make a pillar room.
    makePillarRoom(chunk, topLeft, bottomRight)
  } else if (oneIn(50)) {
    // sometimes make a ragged-edge room
    makeRaggedRoom(chunk, topLeft, bottomRight)
  }

  return true
}

function makePillarRoom(chunk: Cave, p1: Loc, p2: Loc) {
  /*
   *  if dimension is even, don't always put a pillar in the corners
   *
   * X Offset 0:
   *     01234567
   *    ##########
   *  1 ## # # # # --+
   *  2 #        #   |--- y2 - y1 = 2
   *  3 ## # # # # --+
   *    ##########
   *     |      |
   *     +------+--------- x2 - x1 = 7
   *
   * X Offset 1:
   *     12345678
   *    ##########
   *  1 #        # --+
   *  2 ## # # # #   |--- y2 - y1 = 2
   *  3 #        # --+
   *    ##########
   *     |      |
   *     +------+--------- x2 - x1 = 7
   */
  const xOffset = (p2.x - p1.x) % 2 === 0 ? 0 : randInt0(2)
  const yOffset = (p2.y - p1.y) % 2 === 0 ? 0 : randInt0(2)

  for (let y = p1.y + yOffset; y <= p2.y; y += 2) {
    for (let x = p1.x + xOffset; x <= p2.x; x += 2) {
      chunk.setMarkedGranite(loc(x, y), SQUARE.WALL_INNER)
    }
  }

  if (yOffset === 0) {
    /*
     *    +--- marked unavailable to tunnels
     *    |
     *    |01234567
     *    X#########
     *  1 ## # # # #
     *  2 #        #
     *  3 ## # # # #
     *    ##########
     */
    if (xOffset === 0) {
      const outerTopLeft = p1.offset(-1)
      chunk.turnOff(outerTopLeft, SQUARE.ROOM)
      chunk.turnOff(outerTopLeft, SQUARE.WALL_OUTER)
    }
    if ((p2.x - p1.x - xOffset) % 2 === 0) {
      const outerBottomLeft = p1.tr(1, -1)
      chunk.turnOff(outerBottomLeft, SQUARE.ROOM)
      chunk.turnOff(outerBottomLeft, SQUARE.WALL_OUTER)
    }
  }

  if ((p2.y - p1.y - yOffset) % 2 === 0) {
    if (xOffset === 0) {
      const outerTopRight = p1.tr(-1, 1)
      chunk.turnOff(outerTopRight, SQUARE.ROOM)
      chunk.turnOff(outerTopRight, SQUARE.WALL_OUTER)
    }
    if ((p2.x - p1.x - xOffset) % 2 === 0) {
      const outerBottomRight = p1.offset(1)
      chunk.turnOff(outerBottomRight, SQUARE.ROOM)
      chunk.turnOff(outerBottomRight, SQUARE.WALL_OUTER)
    }
  }
}

// i.e., columns around the outside
function makeRaggedRoom(chunk: Cave, p1: Loc, p2: Loc) {
  const xOffset = (p2.x - p1.x) % 2 === 0 ? 0 : randInt0(2)
  const yOffset = (p2.y - p1.y) % 2 === 0 ? 0 : randInt0(2)

  for (let y = p1.y + 2 + yOffset; y <= p2.y - 2; y += 2) {
    chunk.setMarkedGranite(loc(p1.x, y), SQUARE.WALL_INNER)
    chunk.setMarkedGranite(loc(p2.x, y), SQUARE.WALL_INNER)
  }
  for (let x = p1.x + 2 + xOffset; x <= p2.x - 2; x += 2) {
    chunk.setMarkedGranite(loc(x, p1.y), SQUARE.WALL_INNER)
    chunk.setMarkedGranite(loc(x, p2.y), SQUARE.WALL_INNER)
  }
}
