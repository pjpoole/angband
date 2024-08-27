import { getConstants } from '../../core/loading'
import { oneIn, randInt0, randInt1 } from '../../core/rand'
import { initRect } from '../../utilities/rectangle'

import { Player } from '../../player/player'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { FEAT, FeatureRegistry } from '../features'
import { buildRoom } from '../roomGenerators'
import { SQUARE } from '../square'

export function generate(dungeon: Dungeon, player: Player, minHeight: number, minWidth: number) {
  const constants = getConstants()
  const sizePercent = getSizePercent(dungeon, player)

  const numRooms = Math.trunc((dungeon.profile.rooms * sizePercent) / 100)

  const chunk = new Cave({
    height: constants.world.dungeonHeight,
    width: constants.world.dungeonWidth,
    depth: player.depth,
  })

  // Fill the entire cave with granite to start
  chunk.fillRectangle(
    { x: 0, y: 0 },
    { x: chunk.height - 1, y: chunk.width - 1 },
    FeatureRegistry.get(FEAT.GRANITE),
    SQUARE.NONE
  )

  dungeon.blockHeight = dungeon.profile.blockSize
  dungeon.blockWidth = dungeon.profile.blockSize
  const blockRows = Math.trunc(chunk.height / dungeon.blockHeight)
  const blockColumns = Math.trunc(chunk.width / dungeon.blockWidth)
  dungeon.blockRows = blockRows
  dungeon.blockColumns = blockColumns

  const blocksTried = initRect(blockRows, blockColumns, false)

  // TODO: persist

  let built = 0
  let triedBlocks = 0
  const totalBlocks = blockRows * blockColumns
  while (built < numRooms) {
    if (totalBlocks === triedBlocks) break
    let [bx, by] = pickRandomUntriedBlock(blocksTried)
    triedBlocks++

    if (buildRandomRoom(dungeon, chunk, bx, by)) built++
  }

  // Surround the map with permanent rock
  chunk.drawRectangle(
    { x: 0, y: 0 },
    { x: chunk.width - 1, y: chunk.height - 1},
    FeatureRegistry.get(FEAT.PERM),
    SQUARE.NONE,
    true,
  )
}

function buildRandomRoom(dungeon: Dungeon, chunk: Cave, x: number, y: number): boolean {
  let builtRoom = false
  const cutoffThreshold = randInt0(100)
  const rarity = getRoomRarityCap(dungeon, chunk)

  for (const roomProfile of dungeon.profile.allowedRooms) {
    if (roomProfile.rarity > rarity) continue
    if (roomProfile.cutoff <= cutoffThreshold) continue

    builtRoom = buildRoom(dungeon, chunk, x, y, roomProfile, false)
    if (builtRoom) break
  }
  return builtRoom
}

/*
 * _Guaranteed_ to make a _fair_ pick from the selection in a single pass
 * without external counters.
 *
 * Can be shown via proof by induction: base case, there is one object; oneIn(1)
 * returns certainty. If, for case n-1, the n-1 untried blocks have been chosen
 * with equal probability, then in case n, there is a 1/n chance of picking this
 * block, which has equal probability of overwriting a choice from each of the
 * previous n-1 possible choice; thus each one has a chance of 1/n.
 */
function pickRandomUntriedBlock(blocksTried: boolean[][]): [number, number] {
  const maxY = blocksTried.length
  const maxX = blocksTried[0].length

  let tempX, tempY
  let count = 0
  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
      if (blocksTried[y][x]) continue
      count++
      if (oneIn(count)) {
        tempX = x
        tempY = y
      }
    }
  }

  // should never happen
  if (tempX == null || tempY == null) {
    throw new Error('failed to pick block')
  }

  blocksTried[tempY][tempX] = true
  return [tempX, tempY]

  // should never happen
  throw new Error('fell through loop')
}

function getRoomRarityCap(dungeon: Dungeon, chunk: Cave): number {
  const rarityCutoff = 50 + Math.trunc(chunk.depth / 2)

  let i = 0
  let rarity = 0
  /*
   * The chances of increasing rarity at each iteration decrease
   * Typical values for unusual are ~200
   * They are compared to values that start near 50 and go up towards 100 at
   * dungeon level 100
   *
   * so, at level 1:
   * rarity 0 = 3/4 chance
   * rarity 1 or greater = 1/4 chance
   * rarity 2 or greater = 1/16 chance (exactly rarity 1 = 3/16 chance)
   * rarity 3 or greater = 1/64 chance (exactly rarity 2 = 3/64 chance)
   *
   * at level 100:
   * rarity 0 = 1/2 chance
   * rarity 1 = 1/4
   * rarity 2 = 1/8 ...
   */
  while (i === rarity && i < dungeon.profile.maxRarity) {
    if (randInt0(dungeon.profile.unusual) < rarityCutoff) rarity++
    i++
  }

  return rarity
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
