import { Loc } from '../../core/loc'
import { randInt0 } from '../../core/rand'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { FEAT } from '../features'
import { SQUARE } from '../square'

export function build(
  dungeon: Dungeon,
  chunk: Cave,
  center: Loc,
  rating: number,
): boolean {
  const sizeVary = randInt0(4)

  const height = 9
  const width = 11  + 2 * sizeVary

  if (!chunk.isInbounds(center)) {
    const newCenter = dungeon.findSpace(center.box(height + 2, width + 2))
    if (newCenter == null) return false
    center = newCenter
  }

  const b = center.box(height, width)
  chunk.generateBasicRoom(b, false)

  const innerWall = b.interior()
  chunk.drawRectangle(innerWall, FEAT.GRANITE, SQUARE.WALL_INNER)
  chunk.generateHole(innerWall, FEAT.CLOSED)

  const innerRoom = b.interior(2)
  // TODO: Monster logic

  return true
}
