import { Loc } from '../../../core/loc'
import { oneIn } from '../../../core/rand'

import { Cave } from '../../cave'
import { ORIGIN } from '../../../objects/origin'
import { TV } from '../../../objects/tval'

export function placeObject(
  chunk: Cave,
  pt: Loc,
  level: number,
  good: boolean,
  great: boolean,
  origin: ORIGIN,
  type: TV
) {
}

// TODO: Can simplify algo here
export function placeNVaultObjects(
  chunk: Cave,
  pt: Loc,
  depth: number,
  number: number
) {
  const b = pt.box(5, 7)

  while (number > 0) {
    for (let i = 0; i < 11; i++) {
      // these loops could be combined; we could just put a cap on find nearby
      // grid
      const p1 = chunk.findNearbyGrid(b)
      if (p1 == null) throw new Error('could not place object')

      if (!chunk.tiles.get(pt).canPutItem()) continue

      if (oneIn(4)) {
        chunk.placeGold(p1, depth, ORIGIN.VAULT)
      } else {
        placeObject(chunk, p1, depth, false, false, ORIGIN.SPECIAL, 0)
      }

      break
    }
    number--
  }
}
