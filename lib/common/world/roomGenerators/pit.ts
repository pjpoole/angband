import { Loc } from '../../core/loc'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { FEAT } from '../features'
import { SQUARE } from '../square'

import {
  CaveGenerationParams,
  getCaveParams,
  getNewCenter,
  SizeParams
} from './helpers'
import { drawRectangle, drawRandomHole } from './helpers/geometry'
import { generateBasicRoom } from './helpers/room'

export function build(
  dungeon: Dungeon,
  cave: Cave,
  center: Loc,
  rating: number,
): boolean {
  const size = getSize()

  const newCenter = getNewCenter(dungeon, cave, center, size)
  if (newCenter == null) return false
  center = newCenter

  const chunk = buildChunk(getCaveParams(cave, size))

  cave.composite(chunk, center.box(size.height, size.width))

  return true
}

function buildChunk(params: CaveGenerationParams): Cave {
  const chunk = new Cave(params)

  const b = chunk.box
  generateBasicRoom(chunk, b, false)

  const innerWall = b.interior()
  drawRectangle(chunk, innerWall, FEAT.GRANITE, SQUARE.WALL_INNER)
  drawRandomHole(chunk, innerWall, FEAT.CLOSED)

  const innerRoom = b.interior(2)

  // TODO: monster logic

  return chunk
}

function getSize(): SizeParams {
  return {
    height: 9,
    width: 15,
  }
}
