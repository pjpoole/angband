import { box, Loc } from '../../core/loc'
import { randInt0, randInt1 } from '../../core/rand'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { FEAT, Feature } from '../features'
import { SQUARE } from '../square'

import { drawRectangle } from './helpers/geometry'
import { generateRoomFeature } from './helpers/room'

export function build(
  dungeon: Dungeon,
  chunk: Cave,
  center: Loc,
  rating: number, // not used
): boolean {
  // range 4-7; diameter 8-14
  const radius = 2 + randInt1(2) + randInt1(3)
  const diameter = 2 * radius

  const light = chunk.depth <= randInt1(25)

  if (!chunk.isInbounds(center)) {
    // 5 spaces buffer around the edge of the circle
    const newCenter = dungeon.findSpace(center.box(diameter + 10))
    if (newCenter == null) return false
    center = newCenter
  }

  fillCircle(chunk, center, radius + 1, 0, FEAT.FLOOR, SQUARE.NONE, light)

  const b = center.boxR(radius + 2)
  chunk.setBorderingWalls(b)

  // give large rooms an inner chamber
  if (radius - 4 > 0 && radius - 4 > randInt0(4)) {
    const inner = center.box(5)
    drawRectangle(chunk, inner, FEAT.GRANITE, SQUARE.WALL_INNER)
    // place a door on one of the walls at random
    chunk.generateHole(inner, FEAT.CLOSED)

    // TODO: vault objects
    // TODO: vault monsters
  }

  return true
}

// TODO: this code is opaque; understand what it is doing
// TODO: Take a Box argument
function fillCircle(
  chunk: Cave,
  center: Loc,
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

    const boxes = [
      box(c.x - r - b, c.y - i, c.x + r + b, c.y - i),
      box(c.x - r - b, c.y + i, c.x + r + b, c.y + i),
      box(c.x - i, c.y - r - b, c.x - i, c.y + r + b),
      box(c.x + i, c.y - r - b, c.y + r + b, c.x + i),
    ]

    // fill center cross outwards
    // maybe lots of redundant writes?
    for (const line of boxes) {
      generateRoomFeature(chunk, line, feature, flag, light)
    }
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
