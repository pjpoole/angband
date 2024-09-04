import { Box, Loc } from '../../core/loc'
import { randInt0, randInt1 } from '../../core/rand'
import { debug } from '../../utilities/diagnostic'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { FEAT, Feature } from '../features'
import { SQUARE } from '../square'

import { drawRectangle, drawRandomHole } from './helpers/geometry'
import { generateRoomFeature, setBorderingWalls } from './helpers/room'
import { RoomGeneratorBase } from './RoomGenerator'

export function build(
  dungeon: Dungeon,
  cave: Cave,
  center: Loc,
  rating: number, // not used
): boolean {
  const generator = new CircularRoomGenerator({ depth: cave.depth })
  return generator.draw(dungeon, cave, center)
}

export function buildRoom(): Cave | null {
  const depth = randInt1(100)
  const generator = new CircularRoomGenerator({ depth })
  return generator.build()
}

interface CircularRoomGeneratorParams {
  radius?: number
  depth: number
}

export class CircularRoomGenerator extends RoomGeneratorBase {
  private readonly radius: number

  constructor(params: CircularRoomGeneratorParams) {
    const radius = params.radius ?? 2 + randInt1(2) + randInt1(3)
    const diameter = 2 * radius

    super({ height: diameter + 10, width: diameter + 10, depth: params.depth, padding: 0 })

    this.radius = radius
  }

  build(): Cave {
    const chunk = this.getNewCave()

    const center = chunk.box.center()

    const light = chunk.depth <= randInt1(25)
    const circle = center.box(2 * (this.radius + 1) + 1)
    fillCircle(chunk, circle, 0, FEAT.FLOOR, SQUARE.NONE, light)

    const outer = circle.exterior()
    setBorderingWalls(chunk, circle)

    // give large rooms an inner chamber
    if (this.radius - 4 > 0 && this.radius - 4 > randInt0(4)) {
      const inner = center.box(5)
      drawRectangle(chunk, inner, FEAT.GRANITE, SQUARE.WALL_INNER)
      // place a door on one of the walls at random
      drawRandomHole(chunk, inner, FEAT.CLOSED)

      // TODO: vault objects
      // TODO: vault monsters
    }

    return chunk
  }
}

// TODO: Take a Box argument
function fillCircle(
  chunk: Cave,
  b: Box,
  border: number,
  feature: Feature | FEAT,
  flag: SQUARE,
  light: boolean
) {
  const center = b.center()
  const radius = b.radius

  debug('circle room radius %d, border %d', radius, border)

  let lastR = 0
  let r = radius
  let errorTerm = 0
  // Fill progressively larger circles
  for (let i = 0; i <= radius; i++) {
    // if there is a border and we just shrunk down in radius, bump the border
    // size up by 1
    let b = border !== 0 && lastR > r ? border + 1 : border

    // twice the current radius, plus the border, plus the center
    const length = 2 * (r + b) + 1
    // offset outwards from the center with lines of decreasing width
    const boxes = [
      center.trY(i).box(1, length),
      center.trY(-i).box(1, length),
      center.trX(i).box(length, 1),
      center.trX(-i).box(length, 1),
    ]

    // fill center cross outwards
    // lots of redundant writes
    for (const line of boxes) {
      generateRoomFeature(chunk, line, feature, flag, light)
    }
    lastR = r

    if (i < radius) { // only until the last iteration
      // this is an error term for the length of the hypotenuse
      // a^2 + b^2 = c^2 ==> c^2 - a^2 - b^2 = 0
      // adding/subtracting repeated odd numbers is the same as calculating sums
      // and differences of squares: 1, 4, 9, ... ==> 1, 1 + 3, 1 + 3 + 5, ...
      errorTerm -= 2 * i + 1
      while (true) {
        // if we decrease the radius by 1, will that increase the magnitude of
        // the error term? if so, don't decrease the radius
        const adjustment = 2 * r - 1
        if (Math.abs(errorTerm + adjustment) >= Math.abs(errorTerm)) break
        r--
        errorTerm += adjustment
      }
    }
  }
}
