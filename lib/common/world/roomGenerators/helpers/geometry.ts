import { box, Box, loc } from '../../../core/loc'
import { randInt0 } from '../../../core/rand'

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

export function drawFilledRectangle(
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

// TODO: Maybe return coord of hole
// generate_hole
export function drawRandomHole(chunk: Cave, b: Box, feature: Feature | FEAT) {
  const center = b.center()

  let { x, y } = center
  // pick a random wall center
  switch (randInt0(4)) {
    case 0: y = b.top; break
    case 1: x = b.left; break
    case 2: y = b.bottom; break
    case 3: x = b.right; break
  }
  const point = loc(x, y)
  assert(point.isOnEdge(b))

  chunk.setFeature(chunk.tiles.get(point), feature)
}
