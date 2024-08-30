import { box, Box } from '../../../core/loc'

import { Cave } from '../../cave'
import { FEAT, Feature } from '../../features'
import { SQUARE } from '../../square'

export function drawRectangle(
  chunk: Cave,
  b: Box,
  feature: Feature | FEAT,
  flag?: SQUARE,
  overwritePermanent?: boolean
) {
  overwritePermanent ??= false
  chunk.tiles.forEachBorder(b, (tile) => {
    if (overwritePermanent || !tile.isPermanent()) {
      chunk.setFeature(tile, feature)
    }
    if (flag) tile.turnOn(flag)
  })
}

export function fillRectangle(
  chunk: Cave,
  b: Box,
  feature: Feature | FEAT,
  flag?: SQUARE
) {
  chunk.tiles.forEach(b, (tile) => {
    chunk.setFeature(tile, feature)
    if (flag) tile.turnOn(flag)
  })
}

export function drawPlus(chunk: Cave, b: Box, feature: Feature | FEAT, flag?: SQUARE) {
  const center = b.center()

  chunk.tiles.forEach(box(center.x, b.top, center.x, b.bottom), (tile) => {
    chunk.setFeature(tile, feature)
    if (flag) tile.turnOn(flag)
  })

  chunk.tiles.forEach(box(b.left, center.y, b.right, center.y), (tile) => {
    chunk.setFeature(tile, feature)
    if (flag) tile.turnOn(flag)
  })
}
