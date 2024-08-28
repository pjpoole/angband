import { Coord } from '../../core/coordinate'
import { oneIn } from '../../core/rand'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { RoomTemplate, RoomTemplateRegistry } from '../roomTemplate'
import { getRandomSymmetryTransform, SYMTR } from './helpers/symmetry'

export function build(
  dungeon: Dungeon,
  chunk: Cave,
  center: Coord,
  rating: number,
): boolean {
  return buildRoomTemplateType(dungeon, chunk, center, 1, rating)
}

function buildRoomTemplateType(
  dungeon: Dungeon,
  chunk: Cave,
  center: Coord,
  type: number,
  rating: number,
): boolean {
  const template = getRandomRoomTemplate(type, rating)
  if (template == null) return false

  return buildRoomTemplate(dungeon, chunk, center, template)
}

function buildRoomTemplate(
  dungeon: Dungeon,
  chunk: Cave,
  center: Coord,
  template: RoomTemplate,
): boolean {
  const { height, width } = template

  let symmetryOp, tHeight, tWidth
  if (!chunk.isInbounds(center)) {
    symmetryOp = getRandomSymmetryTransform(
      height,
      width,
      SYMTR.FLAG_NONE,
    )

    tHeight = symmetryOp.height
    tWidth = symmetryOp.width

    if (!dungeon.findSpace(center, tHeight + 2, tWidth + 2)) return false
  } else {
    symmetryOp = getRandomSymmetryTransform(
      height,
      width,
      SYMTR.FLAG_NONE,
      0,
    )

    tHeight = symmetryOp.height
    tWidth = symmetryOp.width

    // no rotate
    assert(tHeight === height && tWidth === width)
  }

  const { rotate, reflect } = symmetryOp

  center.x -= Math.trunc(tHeight / 2)
  center.y -= Math.trunc(tWidth / 2)

  chunk.buildRoomTemplate(center, template)

  return true
}

// TODO: If we encounter this again, make abstract
function getRandomRoomTemplate(
  type: number,
  rating: number
): RoomTemplate | undefined {
  let count = 0
  let found: RoomTemplate | undefined = undefined
  for (const template of RoomTemplateRegistry) {
    count++
    if (template.type === type && template.rating === rating) {
      if (oneIn(count)) found = template
      count++
    }
  }

  return found
}
