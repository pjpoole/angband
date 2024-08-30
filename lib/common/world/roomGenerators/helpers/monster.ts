import { Box, Loc } from '../../../core/loc'
import { randInt0 } from '../../../core/rand'

import { Cave } from '../../cave'
import { ORIGIN } from '../../../objects/origin'
import { Vault } from '../../vault'

// scatter_ext
export function findMonsterPlacements(
  chunk: Cave,
  center: Loc,
  distance: number,
  number: number,
  needLos?: boolean,
  pred?: (pt: Loc) => boolean
): Loc[] {
  const bounds = center.boxR(distance)
  const possibilities = []

  // all fully inbounds
  const clipped = chunk.box.interior().intersect(bounds)

  for (const pt of clipped) {
    if (distance > 1 && center.dist(pt) > distance) continue
    if (needLos && !chunk.hasLOS(center, pt)) continue
    if (pred && !pred(pt)) continue
    possibilities.push(pt)
  }

  const results = []
  let remaining = possibilities.length

  while (results.length < number && remaining > 0) {
    const choice = randInt0(remaining)
    results.push(possibilities[choice])

    remaining--
    possibilities[choice] = possibilities[remaining]
  }

  return results
}

// TODO: what was this named
export function placeNVaultMonsters(
  chunk: Cave,
  pt: Loc,
  depth: number,
  number: number
) {
  if (!chunk.isInbounds(pt)) return

  for (let k = 0; k < number; k++) {
    for (let i = 0; i < 9; i++) {
      const ps = findMonsterPlacements(chunk, pt, 1, 1, true, (p) => {
        return chunk.tiles.get(p).isEmpty()
      })
      if (ps.length === 0) continue
      pickAndPlaceMonster(chunk, ps[0], depth, true, true, ORIGIN.DROP_SPECIAL)
      break
    }
  }
}

export function getVaultMonsters(chunk: Cave,b: Box, vault: Vault, races: Set<string>) {}
export function pickAndPlaceMonster(chunk: Cave, pt: Loc, depth: number, sleep: boolean, groupOk: boolean, origin: ORIGIN) {}
