import { Loc } from '../../core/loc'
import { randInt1 } from '../../core/rand'

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
  const generator = new PitGenerator({ depth: cave.depth })
  return generator.draw(dungeon, cave, center)
}

export function buildRoom(): Cave | null {
  const depth = randInt1(100)
  const generator = new PitGenerator({ depth })
  return generator.build()
}

export class PitGenerator extends RoomGeneratorBase {
  constructor(params: DimensionGeneratingParams) {
    const height = params.height ?? 11
    const width = params.width ?? 17
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

    // TODO: monster logic

    return chunk
  }
}
