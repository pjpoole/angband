import { box, Loc } from '../../core/loc'
import { oneIn, randInt0, randInt1 } from '../../core/rand'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { FEAT } from '../features'

import { buildStarburstRoom } from './helpers/starburst'
import { DimensionGeneratingParams, RoomGeneratorBase } from './RoomGenerator'

const MAX_RETRIES = 2

export function build(
  dungeon: Dungeon,
  cave: Cave,
  center: Loc,
  rating: number, // not used
): boolean {
  for (let tries = 0; tries < MAX_RETRIES; tries++) {
    const generator = new MoriaRoomGenerator({ depth: cave.depth })
    const success = generator.draw(dungeon, cave, center)
    if (success) return true
  }
  return false
}

export function buildRoom(): Cave | null {
  const depth = randInt1(100)
  const generator = new MoriaRoomGenerator({ depth })
  return generator.build()
}

export class MoriaRoomGenerator extends RoomGeneratorBase {
  constructor(params: DimensionGeneratingParams) {
    let height = params.height ?? 8 + randInt0(5) // 8-12
    let width = params.width ?? 10 + randInt0(5) // 10-14

    /*
     * Sometimes, make the room big
     *   15/300 chance: 16-36, 10-14 (tall)
     *  210/300 chance:  8-12, 20-56 (wide)
     *   75/300 chance:  8-12, 10-14 (fallthrough)
     */
    if (oneIn(15)) {
      height *= 1 + randInt1(2) // 2-3
      width *= 2 + randInt1(3) // 3-5
    } else if (!oneIn(4)) {
      if (oneIn(15)) {
        height *= 2 + randInt0(2) // 2-3
      } else {
        width *= 2 + randInt0(3) // 2-4
      }
    }

    super({ height, width, depth: params.depth })
  }

  build(): Cave | null {
    const chunk = this.getNewCave()
    const b = chunk.box
    const light = this.depth <= randInt1(35)

    if (!buildStarburstRoom(chunk, b, light, FEAT.FLOOR, true)) {
      return null
    }

    if (oneIn(10)) {
      const innerWidth = Math.trunc(this.width / 4)
      const innerHeight = Math.trunc(this.height / 4)
      const innerBox = box(
        b.l + randInt0(innerWidth),
        b.t + randInt0(innerHeight),
        b.r - randInt0(innerWidth),
        b.b - randInt0(innerHeight),
      )

      buildStarburstRoom(chunk, innerBox, false, FEAT.PASS_RUBBLE, false)
    }

    return chunk
  }
}
