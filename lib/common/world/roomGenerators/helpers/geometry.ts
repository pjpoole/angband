import { Box } from '../../../core/loc'

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
