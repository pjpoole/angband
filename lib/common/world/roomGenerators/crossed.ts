import { Loc } from '../../core/loc'
import { oneIn, randInRange, randInt1 } from '../../core/rand'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { FEAT } from '../features'
import { SQUARE } from '../square'

import { drawRectangle } from './helpers/geometry'

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
    const newCenter = dungeon.findSpace(center.box(height + 2, width + 2))
    if (newCenter == null) return false
    center = newCenter
  }

  // tall and skinny
  const boxA = center.box(height, 3)
  chunk.generateBasicRoom(boxA, light)

  // short and wide
  const boxB = center.box(3, width)
  chunk.generateBasicRoom(boxB, light)

  const innerBox = boxA.intersect(boxB)

  // Maybe modify the center
  switch (randInt1(4)) {
    case 1:
      // leave open
      break
    case 2:
      // Solid full-space column
      chunk.fillRectangle(innerBox, FEAT.GRANITE, SQUARE.WALL_INNER)
      break
    case 3:
      // Small secret room
      drawRectangle(chunk, innerBox, FEAT.GRANITE, SQUARE.WALL_INNER)
      chunk.generateHole(innerBox, FEAT.SECRET)

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
        chunk.generatePlus(innerBox, FEAT.GRANITE, SQUARE.WALL_INNER)
      } else if (oneIn(3)) {
        // 4/27 chance, single central pillar
        chunk.setMarkedGranite(center, SQUARE.WALL_INNER)
      } // 8/27 chance, fall through
      break
  }

  return true
}
