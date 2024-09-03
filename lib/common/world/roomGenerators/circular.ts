import { box, Loc } from '../../core/loc'
import { randInt0, randInt1 } from '../../core/rand'

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

interface CircularRoomGeneratorParams {
  radius?: number
  depth: number
}

export function buildRoom(): Cave | null {
  const depth = randInt1(100)
  const generator = new CircularRoomGenerator({ depth })
  return generator.build()
}

export class CircularRoomGenerator extends RoomGeneratorBase {
  private readonly radius: number

  constructor(params: CircularRoomGeneratorParams) {
    const radius = params.radius ?? 2 + randInt1(2) + randInt1(3)
    const diameter = 2 * radius

    super({ height: diameter, width: diameter, depth: params.depth })

    this.radius = radius
  }

  build(): Cave {
    const chunk = this.getNewCave()

    const center = chunk.box.center()

    const light = chunk.depth <= randInt1(25)
    fillCircle(chunk, center, this.radius + 1, 0, FEAT.FLOOR, SQUARE.NONE, light)

    const b = center.box(this.radius + 2)
    setBorderingWalls(chunk, b)

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
