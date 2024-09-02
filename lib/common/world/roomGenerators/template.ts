import { loc, Loc } from '../../core/loc'
import { oneIn, randInt0, randInt1 } from '../../core/rand'
import { getRandom } from '../../utilities/iterator'
import { asInteger } from '../../utilities/parsing/primitives'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { FEAT } from '../features'
import { ORIGIN } from '../../objects/origin'
import { ROOMF, RoomTemplate, RoomTemplateRegistry } from '../roomTemplate'
import { SQUARE } from '../square'

import { getSpaceBox, SizeParams } from './helpers'
import { placeClosedDoor, placeSecretDoor } from './helpers/door'
import { placeNVaultMonsters } from './helpers/monster'
import { placeNVaultObjects, placeObject } from './helpers/object'
import { placeRandomStairs } from './helpers/stairs'
import {
  getRandomSymmetryTransform, symmetryTransform,
  SymmetryTransform,
  SYMTR
} from './helpers/symmetry'
import { placeTrap } from './helpers/trap'

export function build(
  dungeon: Dungeon,
  chunk: Cave,
  center: Loc,
  rating: number,
): boolean {
  const template = getRandomRoomTemplate(1, rating)
  if (template == null) return false

  return buildRoomTemplate(dungeon, chunk, center, template)
}

function getNewCenter(dungeon: Dungeon, chunk: Cave, center: Loc, size: SizeParams): [Loc, SymmetryTransform] | [null, null] {
  const { height, width } = size
  let symmetryOp
  if (!chunk.isInbounds(center)) {
    symmetryOp = getRandomSymmetryTransform(
      height,
      width,
      SYMTR.FLAG_NONE,
    )

    const newCenter = dungeon.findSpace(getSpaceBox(center, size))
    if (newCenter == null) return [null, null]
    center = newCenter
  } else {
    symmetryOp = getRandomSymmetryTransform(
      height,
      width,
      SYMTR.FLAG_NONE,
      0,
    )

    // no rotate
    assert(symmetryOp.height === height && symmetryOp.width === width)
  }

  return [center, symmetryOp]
}

function buildRoomTemplate(
  dungeon: Dungeon,
  chunk: Cave,
  center: Loc,
  template: RoomTemplate,
): boolean {
  const size = {
    height: template.height,
    width: template.width,
  }

  const [newCenter, symmetryOp] = getNewCenter(dungeon, chunk, center, size)
  if (newCenter == null) return false
  center = newCenter

  return doBuildRoomTemplate(chunk, center, template, symmetryOp)
}

function doBuildRoomTemplate(
  chunk: Cave,
  center: Loc,
  template: RoomTemplate,
  transform?: SymmetryTransform,
): boolean {
  const { height, width, doors } = template
  const { rotate = 0, reflect = false } = transform ?? {}

  const light = chunk.depth <= randInt1(25)
  // Which random doors will we generate
  const randomDoor = randInt1(doors)
  // Do we generate optional walls
  const randomWalls = oneIn(2)

  const b = center.box(height, width)

  template.room.forEach((char, ptPre) => {
    if (char === ' ') return

    const p = symmetryTransform(ptPre, b, rotate, reflect)
    const tile = chunk.tiles.get(p)
    chunk.setFeature(tile, FEAT.FLOOR)
    assert(tile.isEmpty())

    switch (char) {
      case '%':
        chunk.setMarkedGranite(p, SQUARE.WALL_OUTER)
        if (template.flags.has(ROOMF.FEW_ENTRANCES)) {
          // TODO: append entrance
        }
        break
      case '#':
        chunk.setMarkedGranite(p, SQUARE.WALL_SOLID)
        break
      case '+':
        placeClosedDoor(chunk, p)
        break
      case '^':
        if (oneIn(4)) {
          placeTrap(chunk, p, -1, chunk.depth)
        }
        break
      case 'x':
        if (randomWalls) chunk.setMarkedGranite(p, SQUARE.WALL_SOLID)
        break
      case '(':
        if (randomWalls) placeSecretDoor(chunk, p)
        break
      case ')':
        if (!randomWalls) placeSecretDoor(chunk, p)
        else chunk.setMarkedGranite(p, SQUARE.WALL_SOLID)
        break
      case '8':
        // TODO: or dungeon persist
        oneIn(5)
          // TODO: identify if chunk is a quest level
          ? placeRandomStairs(chunk, p, false)
          : placeObject(chunk, p, chunk.depth, false, false, ORIGIN.SPECIAL, 0)
        break
      case '9':

        // handled in second pass
        break
      case '[':
        placeObject(chunk, p, chunk.depth, false, false, ORIGIN.SPECIAL, 0)
        break
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
        const doorNum = asInteger(char)
        doorNum === randomDoor
          ? placeSecretDoor(chunk, p)
          : chunk.setMarkedGranite(p, SQUARE.WALL_SOLID)
        break
    }

    tile.turnOn(SQUARE.ROOM)
    if (light) tile.turnOn(SQUARE.GLOW)
  })

  // Second pass to place items after first pass has completed
  template.room.forEach((char, ptPre) => {
    const pt = symmetryTransform(ptPre, b, rotate, reflect)
    const tile = chunk.tiles.get(pt)

    switch (char) {
      case '#':
        assert(tile.isRoom() && tile.isGranite() && tile.has(SQUARE.WALL_SOLID))

        if ((chunk.countNeighbors(pt, false, (tile) => tile.isRoom()) === 8)) {
          tile.turnOff(SQUARE.WALL_SOLID)
          tile.turnOn(SQUARE.WALL_INNER)
        }
        break
      case '8':
        assert(tile.isRoom() && (tile.isFloor() || tile.isStair()))
        placeNVaultMonsters(chunk, pt, chunk.depth + 2, randInt0(2) + 3)
        break
      case '9':
        const offset1 = loc(2, -2)
        const offset2 = loc(3, -3)

        assert(tile.isRoom() && tile.isFloor())

        placeNVaultMonsters(
          chunk,
          pt.diff(offset2),
          chunk.depth + randInt0(2),
          randInt1(2)
        )
        placeNVaultMonsters(
          chunk,
          pt.diff(offset2),
          chunk.depth + randInt0(2),
          randInt1(2)
        )

        if (oneIn(2)) {
          placeNVaultObjects(chunk, pt.diff(offset1), chunk.depth, randInt1(2))
        }
        if (oneIn(2)) {
          placeNVaultObjects(chunk, pt.diff(offset1), chunk.depth, randInt1(2))
        }
        break
    }
  })

  return true
}


function getRandomRoomTemplate(
  type: number,
  rating: number,
): RoomTemplate | undefined {
  return getRandom(RoomTemplateRegistry, (template) => {
    return template.type === type && template.rating === rating
  })
}
