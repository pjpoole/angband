import { loc, Loc } from '../../core/loc'
import { oneIn, randInt0, randInt1 } from '../../core/rand'
import { debug } from '../../utilities/diagnostic'
import { getRandom } from '../../utilities/iterator'
import { asInteger } from '../../utilities/parsing/primitives'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { FEAT } from '../features'
import { ORIGIN } from '../../objects/origin'
import { ROOMF, RoomTemplate, RoomTemplateRegistry } from '../roomTemplate'
import { SQUARE } from '../square'

import { placeClosedDoor, placeSecretDoor } from './helpers/door'
import { placeNVaultMonsters } from './helpers/monster'
import { placeNVaultObjects, placeObject } from './helpers/object'
import { placeRandomStairs } from './helpers/stairs'
import { getRandomSymmetryTransform, SYMTR } from './helpers/symmetry'
import { placeTrap } from './helpers/trap'
import { RoomGeneratorBase } from './RoomGenerator'

export function build(
  dungeon: Dungeon,
  cave: Cave,
  center: Loc,
  rating: number,
): boolean {
  const template = getRandomRoomTemplate(1, rating)
  if (template == null) return false

  const generator = new TemplateRoomGenerator({ template, depth: cave.depth })
  return generator.draw(dungeon, cave, center)
}

export function buildRoom(): Cave | null {
  const template = getRandomRoomTemplate(1, randInt1(3))
  if (template == null) return null
  const depth = randInt1(100)
  const generator = new TemplateRoomGenerator({ template, depth })
  return generator.build()
}

export interface TemplateRoomGeneratingParams {
  template: RoomTemplate,
  depth: number,
  rotate?: number,
  reflect?: boolean,
}

export class TemplateRoomGenerator extends RoomGeneratorBase {
  private rotate: number
  private reflect: boolean
  private readonly template: RoomTemplate

  constructor(params: TemplateRoomGeneratingParams) {
    const { template, depth, rotate, reflect } = params
    const { height, width } = template

    super({ height, width, depth })

    this.template = template
    this.reflect = reflect ?? false
    this.rotate = rotate ? rotate % 4 : 0
  }

  protected validateCenter(
    dungeon: Dungeon,
    cave: Cave,
    center: Loc
  ): Loc | null {
    const rotationAllowed = cave.isInbounds(center)
    const allowRotate = rotationAllowed ? undefined : 0

    const symmetryOp = getRandomSymmetryTransform(
      this.height,
      this.width,
      SYMTR.FLAG_NONE,
      allowRotate,
    )

    const { rotate, reflect, height, width } = symmetryOp

    if (!rotationAllowed) {
      assert(this.height === height && this.width === width)
    }
    this.height = height
    this.width = width
    this.rotate = rotate
    this.reflect = reflect

    return super.validateCenter(dungeon, cave, center)
  }

  build(): Cave {
    const transform = { rotate: this.rotate, reflect: this.reflect }

    const chunk = this.getNewCave()
    const depth = chunk.depth

    const light = depth <= randInt1(25)
    // Which random doors will we generate
    const randomDoor = randInt1(this.template.doors)
    // Do we generate optional walls
    const randomWalls = oneIn(2)

    this.template.room.transform(transform, (char, p) => {
      if (char === ' ') return

      const tile = chunk.tiles.get(p)
      chunk.setFeature(tile, FEAT.FLOOR)
      assert(tile.isEmpty())

      switch (char) {
        case '%':
          chunk.setMarkedGranite(p, SQUARE.WALL_OUTER)
          if (this.template.flags.has(ROOMF.FEW_ENTRANCES)) {
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
            placeTrap(chunk, p, -1, depth)
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
            : placeObject(
              chunk,
              p,
              depth,
              false,
              false,
              ORIGIN.SPECIAL,
              0
            )
          break
        case '9':

          // handled in second pass
          break
        case '[':
          placeObject(chunk, p, depth, false, false, ORIGIN.SPECIAL, 0)
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
    this.template.room.transform(transform, (char, p) => {
      const tile = chunk.tiles.get(p)

      switch (char) {
        case '#':
          assert(tile.isRoom() && tile.isGranite() && tile.has(SQUARE.WALL_SOLID))

          if ((chunk.countNeighbors(p, false, (tile) => tile.isRoom()) === 8)) {
            tile.turnOff(SQUARE.WALL_SOLID)
            tile.turnOn(SQUARE.WALL_INNER)
          }
          break
        case '8':
          assert(tile.isRoom() && (tile.isFloor() || tile.isStair()))
          placeNVaultMonsters(chunk, p, depth + 2, randInt0(2) + 3)
          break
        case '9':
          const offset1 = loc(2, -2)
          const offset2 = loc(3, -3)

          assert(tile.isRoom() && tile.isFloor())

          placeNVaultMonsters(
            chunk,
            p.diff(offset2),
            depth + randInt0(2),
            randInt1(2)
          )
          placeNVaultMonsters(
            chunk,
            p.diff(offset2),
            depth + randInt0(2),
            randInt1(2)
          )

          if (oneIn(2)) {
            placeNVaultObjects(chunk, p.diff(offset1), depth, randInt1(2))
          }
          if (oneIn(2)) {
            placeNVaultObjects(chunk, p.diff(offset1), depth, randInt1(2))
          }
          break
      }
    })

    return chunk
  }
}

function getRandomRoomTemplate(
  type: number,
  rating: number,
): RoomTemplate | undefined {
  const template = getRandom(RoomTemplateRegistry, (template) => {
    return template.type === type && template.rating === rating
  })

  if (template != null) {
    debug(`type: ${type}, rating: ${rating}, found: ${template.name}`)
  } else {
    debug(`type: ${type}, rating: ${rating}, no template found`)
  }

  return template
}
