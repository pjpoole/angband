import { Coord } from '../../core/coordinate'
import { randInt0 } from '../../core/rand'

import { Dungeon } from '../dungeon'

const MAX_TRIES = 25

export function findSpace(
  dungeon: Dungeon, pt: Coord, height: number, width: number
): boolean {
  const blocksHigh = 1 + Math.trunc((height - 1) / dungeon.blockHeight)
  const blocksWide = 1 + Math.trunc((width - 1) / dungeon.blockWidth)

  for (let i = 0; i < MAX_TRIES; i++) {
    // random starting block in the dungeon
    const p1 = {
      x: randInt0(dungeon.blockColumns),
      y: randInt0(dungeon.blockRows)
    }

    // QUESTION: why -1 ?
    const p2 = {
      x: p1.x + blocksWide - 1,
      y: p1.y + blocksHigh - 1
    }

    if (!dungeon.checkForUnreservedBlocks(p1, p2)) continue

    // mutating here percolates up through the chain
    pt.x = Math.trunc(((p1.x + p2.x + 1) * dungeon.blockHeight) / 2)
    pt.y = Math.trunc(((p1.y + p2.y + 1) * dungeon.blockWidth) / 2)

    dungeon.addCenter(pt)
    dungeon.reserveBlocks(p1, p2)

    return true
  }

  return false
}
