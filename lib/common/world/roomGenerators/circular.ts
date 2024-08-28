import {
  Coord,
  cProd,
  cToBox,
  cToRadius
} from '../../core/coordinate'
import { randInt0, randInt1 } from '../../core/rand'

import { randDirNSEW } from '../../utilities/directions'

import { Cave } from '../cave'
import { Dungeon, findSpace } from '../dungeon'
import { FEAT, Feature } from '../features'
import { SQUARE } from '../square'

export function build(
  dungeon: Dungeon,
  chunk: Cave,
  pt: Coord,
  rating: number, // not used
): boolean {
  // range 4-7; diameter 8-14
  const radius = 2 + randInt1(2) + randInt1(3)
  const diameter = 2 * radius

  const light = chunk.depth <= randInt1(25)

  if (!chunk.isInbounds(pt)) {
    // 5 spaces buffer around the edge of the circle
    // pt may have been mutated here
    if (!findSpace(dungeon, pt, diameter + 10, diameter + 10)) return false
  }

  fillCircle(chunk, pt, radius + 1, 0, FEAT.FLOOR, SQUARE.NONE, light)

  const [upperLeft, lowerRight] = cToBox(pt, radius + 2)

  chunk.setBorderingWalls(upperLeft, lowerRight)

  // give large rooms an inner chamber
  if (radius - 4 > 0 && radius - 4 > randInt0(4)) {
    const offset = cProd(randDirNSEW(), 2)

    chunk.drawRectangle(...cToRadius(pt, 2), FEAT.GRANITE, SQUARE.WALL_INNER, false)
    chunk.placeClosedDoor(offset)

    // TODO: vault objects
    // TODO: vault monsters
  }

  return true
}

// TODO: this code is opaque; understand what it is doing
function fillCircle(
  chunk: Cave,
  center: Coord,
  radius: number,
  border: number,
  feature: Feature | FEAT,
  flag: SQUARE,
  light: boolean
) {
  let last = 0
  let r = radius
  let c = center
  let pythag = 0
  // Fill progressively larger circles
  for (let i = 0; i <= radius; i++) {
    let b = border !== 0 && last > r ? border + 1 : border

    // fill center cross outwards
    // maybe lots of redundant writes?
    chunk.fillHorizontal(c.y - i, c.x - r - b, c.x + r + b, feature, flag, light)
    chunk.fillHorizontal(c.y + i, c.x - r - b, c.x + r + b, feature, flag, light)
    chunk.fillVertical(c.x - i, c.y - r - b, c.x + r + b, feature, flag, light)
    chunk.fillVertical(c.x + i, c.y - r - b, c.x + r + b, feature, flag, light)
    last++

    if (i < radius) {
      pythag -= 2 * i + 1
      while (true) {
        const adjustment = 2 * r - 1
        if (Math.abs(pythag + adjustment) >= Math.abs(pythag)) break
        r--
        pythag += adjustment
      }
    }
  }
}
