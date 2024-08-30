import { box, Box } from '../../../core/loc'

import { Cave } from '../../cave'
import { SQUARE } from '../../square'
import { FEAT, Feature } from '../../features'

import { drawRectangle, drawFilledRectangle } from './geometry'

export function generateBasicRoom(
  chunk: Cave,
  b: Box,
  light: boolean,
): void {
  const outerBox = b.exterior()
  generateRoom(chunk, outerBox, light)
  drawRectangle(chunk, outerBox, FEAT.GRANITE, SQUARE.WALL_OUTER)
  drawFilledRectangle(chunk, b, FEAT.FLOOR, SQUARE.NONE)
}

export function generateRoom(chunk: Cave, b: Box, light: boolean) {
  chunk.tiles.forEach(b, (tile) => {
    tile.turnOn(SQUARE.ROOM)
    if (light) tile.turnOn(SQUARE.GLOW)
  })
}

export function generateRoomFeature(
  chunk: Cave,
  b: Box,
  feature: Feature | FEAT,
  flag?: SQUARE,
  light?: boolean,
) {
  chunk.tiles.forEach(b, (tile) => {
    chunk.setFeature(tile, feature)
    if (flag) tile.turnOn(flag)

    tile.turnOn(SQUARE.ROOM)
    if (light) tile.turnOn(SQUARE.GLOW)
  })
}
