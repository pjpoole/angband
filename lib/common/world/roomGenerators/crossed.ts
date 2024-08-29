import { loc, Loc } from '../../core/loc'
import { oneIn, randInRange, randInt1 } from '../../core/rand'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { FEAT } from '../features'
import { SQUARE } from '../square'

export function build(
  dungeon: Dungeon,
  chunk: Cave,
  center: Loc,
  rating: number, // not used
): boolean {
  const light = chunk.depth <= randInt1(25)

  const deltaX = randInRange(3, 11)
  const deltaY = randInRange(3, 4)

  const height = 2 * deltaY + 1
  const width = 2 * deltaX + 1

  if (!chunk.isInbounds(center)) {
    if (!dungeon.findSpace(center, height + 2, width + 2)) return false
  }

  // tall and skinny
  const [roomATopLeft, roomABottomRight] = center.boxCorners(height, 3)
  chunk.generateBasicRoom(roomATopLeft, roomABottomRight, light)

  // short and wide
  const [roomBTopLeft, roomBBottomRight] = center.boxCorners(3, width)
  chunk.generateBasicRoom(roomBTopLeft, roomBBottomRight, light)

  const innerTopLeftCorner = loc(roomATopLeft.x, roomBTopLeft.y)
  const innerBottomRightCorner = loc(roomABottomRight.x, roomBBottomRight.y)

  // Maybe modify the center
  switch (randInt1(4)) {
    case 1:
      // leave open
      break
    case 2:
      // Solid full-space column
      chunk.fillRectangle(innerTopLeftCorner, innerBottomRightCorner, FEAT.GRANITE, SQUARE.WALL_INNER)
      break
    case 3:
      // Small secret room
      chunk.drawRectangle(innerTopLeftCorner, innerBottomRightCorner, FEAT.GRANITE, SQUARE.WALL_INNER)
      chunk.generateHole(innerTopLeftCorner, innerBottomRightCorner, FEAT.SECRET)

      // TODO: treasure
      // TODO: monsters
      // TODO: traps
      break
    case 4:
      if (oneIn(3)) {
        // 1/3 chance, "pinched" - five rooms with an open floor in the center
        //                         of the wall
        for (let y = innerTopLeftCorner.y; y <= innerBottomRightCorner.y; y++) {
          if (y === center.y) continue
          chunk.setMarkedGranite(loc(innerTopLeftCorner.x - 1, y), SQUARE.WALL_INNER)
          chunk.setMarkedGranite(loc(innerBottomRightCorner.x + 1, y), SQUARE.WALL_INNER)
        }

        for (let x = innerTopLeftCorner.x; x <= innerBottomRightCorner.x; x++) {
          if (x === center.x) continue
          chunk.setMarkedGranite(loc(x, innerTopLeftCorner.y - 1), SQUARE.WALL_INNER)
          chunk.setMarkedGranite(loc(x, innerBottomRightCorner.y + 1), SQUARE.WALL_INNER)
        }
      } else if (oneIn(3)) {
        // 2/9 chance, plus
        chunk.generatePlus(innerTopLeftCorner, innerBottomRightCorner, FEAT.GRANITE, SQUARE.WALL_INNER)
      } else if (oneIn(3)) {
        // 4/27 chance, single central pillar
        chunk.setMarkedGranite(center, SQUARE.WALL_INNER)
      } // 8/27 chance, fall through
      break
  }

  return true
}
