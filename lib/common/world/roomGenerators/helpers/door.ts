import { Loc } from '../../../core/loc'
import { randInt0 } from '../../../core/rand'

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

export function placeRandomDoor(chunk: Cave, pt: Loc) {
  const tmp = randInt0(10)

  const tile = chunk.get(pt)
  if (tmp < 3) {
    chunk.setFeature(tile, FEAT.OPEN)
  } else if (tmp < 4) {
    chunk.setFeature(tile, FEAT.BROKEN)
  } else {
    placeClosedDoor(chunk, pt)
  }
}
