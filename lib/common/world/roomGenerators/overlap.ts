import { Box, box, Loc } from '../../core/loc'
import { randInt1 } from '../../core/rand'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'

import { generateOverlapRooms } from './helpers/room'
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
    ).exterior()
    const boxB = box(
      -1 * randInt1(3),
      -1 * randInt1(10),
      randInt1(4),
      randInt1(11),
    ).exterior()

    // clear a space double the size of the max delta
    const union = boxA.union(boxB)
    const maxDx = Math.max(-1 * union.l, union.r)
    const maxDy = Math.max(-1 * union.t, union.b)

    // outer bounding box
    const width = 2 * maxDx + 1
    const height = 2 * maxDy + 1

    super({ height, width, depth: params.depth, padding: 0 })

    const tr = union.topLeft.mult(-1)

    // rest to (0, 0) basis
    this.boxA = boxA.tr(tr)
    this.boxB = boxB.tr(tr)
  }

  build(): Cave {
    const chunk = this.getNewCave()

    const light = chunk.depth <= randInt1(25)

    generateOverlapRooms(chunk, this.boxA, this.boxB, light)

    return chunk
  }
}
