import { Loc } from '../../core/loc'

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

export class PitGenerator extends RoomGeneratorBase {
  constructor(params: DimensionGeneratingParams) {
    const height = params.height ?? 9
    const width = params.width ?? 15
    super({ height, width, depth: params.depth })
  }

  build(): Cave {
    const chunk = this.getNewCave()

    const b = chunk.box
    generateBasicRoom(chunk, b, false)

    const innerWall = b.interior()
    drawRectangle(chunk, innerWall, FEAT.GRANITE, SQUARE.WALL_INNER)
    drawRandomHole(chunk, innerWall, FEAT.CLOSED)

    const innerRoom = b.interior(2)

    // TODO: monster logic

    return chunk
  }
}
