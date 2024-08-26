import { getConstants } from '../../core/loading'
import { oneIn, randInt0, randInt1 } from '../../core/rand'

import { Player } from '../../player/player'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { FEAT, FeatureRegistry } from '../features'
import { SQUARE } from '../square'
import { buildRoom } from '../room'

export function generate(dungeon: Dungeon, player: Player, minHeight: number, minWidth: number) {
  const constants = getConstants()
  const sizePercent = getSizePercent(dungeon, player)

  const numRooms = Math.trunc((dungeon.profile.rooms * sizePercent) / 100)

  const chunk = new Cave({
    height: constants.world.dungeonHeight,
    width: constants.world.dungeonWidth,
    depth: player.depth,
  })

  chunk.fillRectangle(0, 0, chunk.height - 1, chunk.width - 1, FeatureRegistry.get(FEAT.GRANITE), SQUARE.NONE)

  dungeon.blockHeight = dungeon.profile.blockSize
  dungeon.blockWidth = dungeon.profile.blockSize
  const blockRows = Math.trunc(chunk.height / dungeon.blockHeight)
  const blockColumns = Math.trunc(chunk.width / dungeon.blockWidth)
  dungeon.blockRows = blockRows
  dungeon.blockColumns = blockColumns

  const blocksTried: boolean[][] = new Array(blockColumns)
  for (let i = 0; i < blockColumns; i++) {
    blocksTried[i] = new Array(blockRows)
    for (let j = 0; j < blockRows; j++) {
      blocksTried[i][j] = false
    }
  }

  // TODO: persist

  let built = 0
  while (built < numRooms) {
    let j = 0
    let tby = 0
    let tbx = 0
    let by: number
    let bx: number
    for (by = 0; by < blockRows; by++) {
      for (bx = 0; bx < blockColumns; bx++) {
        if (blocksTried[by][bx]) continue
        j++
        if (oneIn(j)) {
          tby = by
          tbx = bx
        }
      }
    }

    bx = tbx
    by = tby

    if (j === 0) break

    if (blocksTried[by][bx]) throw new Error('inconsistent blocks')
    blocksTried[by][bx]

    const key = randInt0(100)

    let i = 0
    let rarity = 0
    while (i === rarity && i < dungeon.profile.maxRarity) {
      if (randInt0(dungeon.profile.unusual) < 50 + Math.trunc(chunk.depth / 2)) rarity++
      i++
    }

    for (const roomProfile of dungeon.profile.allowedRooms) {
      if (roomProfile.rarity > rarity) continue
      if (roomProfile.cutoff <= key) continue

      if (buildRoom(dungeon, chunk, bx, by, roomProfile, false)) {
        built++
        break
      }
    }
  }

}

// Supposedly unused
function getSizePercent(dungeon: Dungeon, player: Player) {
  const i = Math.trunc(randInt1(10) + player.depth / 24)
  if (dungeon.quest) return 100
  else if (i < 2) return 75
  else if (i < 3) return 80
  else if (i < 4) return 85
  else if (i < 5) return 90
  else if (i < 6) return 100

  return 100
}
