import { Box, loc, Loc } from '../../core/loc'
import { oneIn, randInt0, randInt1 } from '../../core/rand'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { SQUARE } from '../square'

import { generateBasicRoom } from './helpers/room'
import { DimensionGeneratingParams, RoomGeneratorBase } from './RoomGenerator'

export function build(
  dungeon: Dungeon,
  cave: Cave,
  center: Loc,
  rating: number, // not used
): boolean {
  const generator = new SimpleRoomGenerator({ depth: cave.depth })
  return generator.draw(dungeon, cave, center)
}

export function buildRoom(): Cave | null {
  const depth = randInt1(100)
  const generator = new SimpleRoomGenerator({ depth })
  return generator.build()
}

export class SimpleRoomGenerator extends RoomGeneratorBase {
  constructor(params: DimensionGeneratingParams) {
    const height = params.height ?? 1 + randInt1(4) + randInt1(3) // 3-8
    const width = params.width ?? 1 + randInt1(11) + randInt1(11) // 3-23

    super({ height, width, depth: params.depth })
  }

  build(): Cave {
    const chunk = this.getNewCave()

    const light = chunk.depth <= randInt1(25)

    // wall boundaries
    const b = chunk.box
    generateBasicRoom(chunk, b, light)

    if (oneIn(20)) {
      // sometimes make a pillar room.
      makePillarRoom(chunk, b)
    } else if (oneIn(50)) {
      // sometimes make a ragged-edge room
      makeRaggedRoom(chunk, b)
    }

    return chunk
  }
}

function makePillarRoom(chunk: Cave, b: Box) {
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
  const xOffset = (b.right - b.left) % 2 === 0 ? 0 : randInt0(2)
  const yOffset = (b.bottom - b.top) % 2 === 0 ? 0 : randInt0(2)

  for (let y = b.top + yOffset; y <= b.bottom; y += 2) {
    for (let x = b.left + xOffset; x <= b.right; x += 2) {
      chunk.setMarkedGranite(loc(x, y), SQUARE.WALL_INNER)
    }
  }

  /*
   *    +--- marked unavailable to tunnels
   *    |
   *    |01234567
   *    X#########
   *  1 ## # # # #
   *  2 #        #
   *  3 ## # # # #
   *    X#########
   */
  const outer = b.exterior()
  const colsToLeft = xOffset === 0
  const colsToTop = yOffset === 0
  const colsToRight = ((b.right - b.left - xOffset) % 2) === 0
  const colsToBottom = (b.bottom - b.top - yOffset) % 2 === 0

  if (colsToTop) {
    if (colsToLeft) markNoConnection(chunk, loc(outer.left, outer.top))
    if (colsToRight) markNoConnection(chunk, loc(outer.right, outer.top))
  }

  if (colsToBottom) {
    if (colsToLeft) markNoConnection(chunk, loc(outer.left, outer.bottom))
    if (colsToRight) markNoConnection(chunk, loc(outer.right, outer.bottom))
  }
}

function markNoConnection (chunk: Cave, p: Loc) {
  chunk.turnOff(p, SQUARE.ROOM)
  chunk.turnOff(p, SQUARE.WALL_OUTER)
}

// i.e., columns around the outside
function makeRaggedRoom(chunk: Cave, b: Box) {
  const xOffset = (b.right - b.left) % 2 === 0 ? 0 : randInt0(2)
  const yOffset = (b.bottom - b.top) % 2 === 0 ? 0 : randInt0(2)

  for (let y = b.top + 2 + yOffset; y <= b.bottom - 2; y += 2) {
    chunk.setMarkedGranite(loc(b.left, y), SQUARE.WALL_INNER)
    chunk.setMarkedGranite(loc(b.right, y), SQUARE.WALL_INNER)
  }
  for (let x = b.left + 2 + xOffset; x <= b.right - 2; x += 2) {
    chunk.setMarkedGranite(loc(x, b.top), SQUARE.WALL_INNER)
    chunk.setMarkedGranite(loc(x, b.bottom), SQUARE.WALL_INNER)
  }
}
