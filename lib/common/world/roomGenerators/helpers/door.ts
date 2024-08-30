import { Loc } from '../../../core/loc'

import { Cave } from '../../cave'
import { FEAT } from '../../features'

export function placeClosedDoor(chunk: Cave, pt: Loc) {
  const tile = chunk.tiles.get(pt)
  chunk.setFeature(tile, FEAT.CLOSED)
  // TODO: traps: randomly set door lock strength
}

export function placeSecretDoor(chunk: Cave, pt: Loc) {
  const tile = chunk.tiles.get(pt)
  chunk.setFeature(tile, FEAT.SECRET)
}
