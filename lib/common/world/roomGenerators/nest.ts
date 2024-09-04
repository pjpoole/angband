import { Loc } from '../../core/loc'
import { randInt0, randInt1 } from '../../core/rand'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { FEAT } from '../features'
import { SQUARE } from '../square'

import { drawRectangle, drawRandomHole } from './helpers/geometry'
import { generateBasicRoom } from './helpers/room'
import { DimensionGeneratingParams, RoomGeneratorBase } from './RoomGenerator'

export function build(
  dungeon: Dungeon,
  cave: Cave,
  center: Loc,
  rating: number,
): boolean {
  const generator = new NestGenerator({ depth: cave.depth })
  return generator.draw(dungeon, cave, center)
}

export function buildRoom(): Cave | null {
  const depth = randInt1(100)
  const generator = new NestGenerator({ depth })
  return generator.build()
}

export class NestGenerator extends RoomGeneratorBase {
  constructor(params: DimensionGeneratingParams) {
    const sizeVary = randInt0(4)

    const height = params.height ?? 11
    const width = params.width ?? 13 + 2 * sizeVary

    super({ height, width, depth: params.depth, padding: 0 })
  }

  build(): Cave {
    const chunk = this.getNewCave()

    const b = chunk.box
    generateBasicRoom(chunk, b, false)

    const innerWall = b.interior(2)
    drawRectangle(chunk, innerWall, FEAT.GRANITE, SQUARE.WALL_INNER)
    drawRandomHole(chunk, innerWall, FEAT.CLOSED)

    const innerRoom = innerWall.interior()
    // TODO: Monster logic

    return chunk
  }
}
