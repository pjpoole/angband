import { Loc } from '../../core/loc'
import { getRandom } from '../../utilities/iterator'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { RoomTemplate, RoomTemplateRegistry } from '../roomTemplate'
import { getRandomSymmetryTransform, SYMTR } from './helpers/symmetry'

export function build(
  dungeon: Dungeon,
  chunk: Cave,
  center: Loc,
  rating: number,
): boolean {
  return buildRoomTemplateType(dungeon, chunk, center, 1, rating)
}

function buildRoomTemplateType(
  dungeon: Dungeon,
  chunk: Cave,
  center: Loc,
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
  center: Loc,
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

    const newCenter = dungeon.findSpace(center.box(tHeight + 2, tWidth + 2))
    if (newCenter == null) return false
    center = newCenter
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

  center = center.tr(-1 * Math.trunc(tHeight / 2), -1 * Math.trunc(tWidth / 2))

  return chunk.buildRoomTemplate(center, template, symmetryOp)
}

function getRandomRoomTemplate(
  type: number,
  rating: number,
): RoomTemplate | undefined {
  return getRandom(RoomTemplateRegistry, (template) => {
    return template.type === type && template.rating === rating
  })
}
