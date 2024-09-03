import { Box, box, Loc } from '../../core/loc'
import { randInt1 } from '../../core/rand'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { FEAT } from '../features'
import { SQUARE } from '../square'

import { drawRectangle, drawFilledRectangle } from './helpers/geometry'
import { generateRoom } from './helpers/room'
import { DimensionGeneratingParams, RoomGeneratorBase } from './RoomGenerator'

export function build(
  dungeon: Dungeon,
  cave: Cave,
  center: Loc,
  rating: number, // not used
): boolean {
  const generator = new OverlapRoomGenerator({ depth: cave.depth })
  return generator.draw(dungeon, cave, center)
}

export function buildRoom(): Cave | null {
  const depth = randInt1(100)
  const generator = new OverlapRoomGenerator({ depth })
  return generator.build()
}

export class OverlapRoomGenerator extends RoomGeneratorBase {
  private readonly boxA: Box
  private readonly boxB: Box

  constructor(params: DimensionGeneratingParams) {
    // TODO: permit dynamic height / width
    // generate room deltas
    const boxA = box(
      -1 * randInt1(11),
      -1 * randInt1(4),
      randInt1(10),
      randInt1(3),
    )
    const boxB = box(
      -1 * randInt1(3),
      -1 * randInt1(10),
      randInt1(4),
      randInt1(11),
    )

    // clear a space double the size of the max delta
    const union = boxA.union(boxB)
    const maxDx = Math.max(-1 * union.l, union.r)
    const maxDy = Math.max(-1 * union.t, union.b)

    // outer bounding box
    const width = 2 * maxDx + 1
    const height = 2 * maxDy + 1

    super({ height, width, depth: params.depth })

    const tr = union.topLeft.mult(-1)

    // rest to (0, 0) basis
    this.boxA = boxA.tr(tr)
    this.boxB = boxB.tr(tr)
  }

  build(): Cave {
    const chunk = this.getNewCave()

    const light = chunk.depth <= randInt1(25)

    const extRoomA = this.boxA.exterior()
    const extRoomB = this.boxB.exterior()

    // Same contents as generateBasicRoom, but interleaved
    // This ensures that the walls won't overlap the floors
    generateRoom(chunk, extRoomA, light)
    generateRoom(chunk, extRoomB, light)
    drawRectangle(chunk, extRoomA, FEAT.GRANITE, SQUARE.WALL_OUTER)
    drawRectangle(chunk, extRoomB, FEAT.GRANITE, SQUARE.WALL_OUTER)
    drawFilledRectangle(chunk, this.boxA, FEAT.FLOOR, SQUARE.NONE)
    drawFilledRectangle(chunk, this.boxB, FEAT.FLOOR, SQUARE.NONE)

    return chunk
  }
}
