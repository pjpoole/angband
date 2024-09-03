import { Loc } from '../../core/loc'
import { oneIn, randInRange, randInt1 } from '../../core/rand'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { FEAT } from '../features'
import { SQUARE } from '../square'

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
  const generator = new CrossedRoomGenerator({ depth: cave.depth })
  return generator.draw(dungeon, cave, center)
}

export class CrossedRoomGenerator extends RoomGeneratorBase {
  constructor(params: DimensionGeneratingParams) {
    let { depth, width, height } = params

    height ??= 2 * randInRange(3, 4) + 1
    width ??= 2 * randInRange(3, 11) + 1

    super({ height, width, depth })
  }

  build(): Cave {
    const chunk = this.getNewCave()
    const center = chunk.box.center()

    const light = chunk.depth <= randInt1(25)

    // tall and skinny
    const boxA = center.box(this.height, 3)
    generateBasicRoom(chunk, boxA, light)

    // short and wide
    const boxB = center.box(3, this.width)
    generateBasicRoom(chunk, boxB, light)

    const innerBox = boxA.intersect(boxB)

    // Maybe modify the center
    switch (randInt1(4)) {
      case 1:
        // leave open
        break
      case 2:
        // Solid full-space column
        drawFilledRectangle(chunk, innerBox, FEAT.GRANITE, SQUARE.WALL_INNER)
        break
      case 3:
        // Small secret room
        drawRectangle(chunk, innerBox, FEAT.GRANITE, SQUARE.WALL_INNER)
        drawRandomHole(chunk, innerBox, FEAT.SECRET)

        // TODO: treasure
        // TODO: monsters
        // TODO: traps
        break
      case 4:
        if (oneIn(3)) {
          // 1/3 chance, "pinched" - five rooms with an open floor in the center
          //                         of the wall
          const exterior = innerBox.exterior()
          for (const p of exterior.borders()) {
            if (p.isCorner(exterior)) continue
            if (p.y === center.y) continue
            if (p.x === center.x) continue
            chunk.setMarkedGranite(p, SQUARE.WALL_INNER)
          }
        } else if (oneIn(3)) {
          // 2/9 chance, plus
          drawPlus(chunk, innerBox, FEAT.GRANITE, SQUARE.WALL_INNER)
        } else if (oneIn(3)) {
          // 4/27 chance, single central pillar
          chunk.setMarkedGranite(center, SQUARE.WALL_INNER)
        } // 8/27 chance, fall through
        break
    }

    return chunk
  }
}
