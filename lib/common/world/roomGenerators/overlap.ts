import { box, Loc } from '../../core/loc'
import { randInt1 } from '../../core/rand'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { FEAT } from '../features'
import { SQUARE } from '../square'

import { drawRectangle, drawFilledRectangle } from './helpers/geometry'
import { generateRoom } from './helpers/room'

export function build(
  dungeon: Dungeon,
  chunk: Cave,
  center: Loc,
  rating: number, // not used
): boolean {
  const light = chunk.depth <= randInt1(25)

  // generate room deltas
  const r1l = randInt1(11)
  const r1t = randInt1(4)
  const r1r = randInt1(10)
  const r1b = randInt1(3)

  const r2l = randInt1(3)
  const r2t = randInt1(10)
  const r2r = randInt1(4)
  const r2b = randInt1(11)

  // clear a space double the size of the max delta
  const maxdx = Math.max(r1l, r1r, r2l, r2r)
  const maxdy = Math.max(r1t, r1b, r2t, r2b)

  // outer bounding box
  const width = 2 * maxdx + 1
  const height = 2 * maxdy + 1

  if (!chunk.isInbounds(center)) {
    const newCenter = dungeon.findSpace(center.box(height + 2, width + 2))
    if (newCenter == null) return false
    center = newCenter
  }

  const roomA = box(
    center.x - r1l,
    center.y - r1t,
    center.x + r1r,
    center.y + r1b,
  )
  const roomB = box(
    center.x - r2l,
    center.y - r2t,
    center.x + r2r,
    center.y + r2b,
  )

  // Same contents as generateBasicRoom, but interleaved
  // This ensures that the walls won't overlap the floors
  const extRoomA = roomA.exterior()
  const extRoomB = roomB.exterior()

  generateRoom(chunk, extRoomA, light)
  generateRoom(chunk, extRoomB, light)
  drawRectangle(chunk, extRoomA, FEAT.GRANITE, SQUARE.WALL_OUTER)
  drawRectangle(chunk, extRoomB, FEAT.GRANITE, SQUARE.WALL_OUTER)
  drawFilledRectangle(chunk, roomA, FEAT.FLOOR, SQUARE.NONE)
  drawFilledRectangle(chunk, roomB, FEAT.FLOOR, SQUARE.NONE)

  return true
}
