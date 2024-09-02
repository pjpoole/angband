import { Loc } from '../../core/loc'
import { randInt0 } from '../../core/rand'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { FEAT } from '../features'
import { SQUARE } from '../square'

import { getNewCenter } from './helpers'
import { drawRectangle, drawRandomHole } from './helpers/geometry'
import { generateBasicRoom } from './helpers/room'

export function build(
  dungeon: Dungeon,
  chunk: Cave,
  center: Loc,
  rating: number,
): boolean {
  const sizeVary = randInt0(4)

  const height = 9
  const width = 11  + 2 * sizeVary

  const size = { height, width }

  const newCenter = getNewCenter(dungeon, chunk, center, size)
  if (newCenter == null) return false
  center = newCenter

  const b = center.box(height, width)
  generateBasicRoom(chunk, b, false)

  const innerWall = b.interior()
  drawRectangle(chunk, innerWall, FEAT.GRANITE, SQUARE.WALL_INNER)
  drawRandomHole(chunk, innerWall, FEAT.CLOSED)

  const innerRoom = b.interior(2)
  // TODO: Monster logic

  return true
}

function getMonsterNumberPrep() {

}
