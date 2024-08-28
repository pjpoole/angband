import { Coord, cToBox } from '../../core/coordinate'
import { oneIn, randInt0, randInt1 } from '../../core/rand'

import { findSpace } from './helpers'
import { buildStarburstRoom } from './starburst'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { FEAT } from '../features'

const MAX_TRIES = 1

export function build(
  dungeon: Dungeon,
  chunk: Cave,
  center: Coord,
  rating: number, // not used
): boolean {
  const light = chunk.depth <= randInt1(35)

  let height = 8 + randInt0(5) // 8-12
  let width = 10 + randInt0(5) // 10-14

  for (let tries = 0; tries <= MAX_TRIES; tries++) {
    [height, width] = randomizeRoomSize(tries)

    if (!chunk.isInbounds(center)) {
      if (!findSpace(dungeon, center, height, width)) {
        if (tries < MAX_TRIES) continue
        if (tries === MAX_TRIES) return false
      }
    }
  }

  const [topLeft, bottomRight] = cToBox(center, height, width)

  if (!buildStarburstRoom(chunk, topLeft, bottomRight, light, FEAT.FLOOR, true)) {
    return false
  }

  if (oneIn(10)) {
    const innerTopLeft = {
      x: topLeft.x + randInt0(Math.trunc(height / 4)),
      y: topLeft.y + randInt0(Math.trunc(width / 4)),
    }
    const innerBottomRight = {
      x: bottomRight.x - randInt0(Math.trunc(height / 4)),
      y: bottomRight.y - randInt0(Math.trunc(width / 4)),
    }

    buildStarburstRoom(chunk, innerTopLeft, innerBottomRight, false, FEAT.PASS_RUBBLE, false)
  }

  return true
}

function randomizeRoomSize(tries: number): [number, number] {
  let height = 8 + randInt0(5) // 8-12
  let width = 10 + randInt0(5) // 10-14

  /*
   * Sometimes, make the room big
   * first try:
   *   20/300 chance: 16-36, 30-70 (big)
   *   14/300 chance: 16-36, 10-14 (tall)
   *  196/300 chance:  8-12, 20-56 (wide)
   *   70/300 chance:  8-12, 10-14 (fallthrough)
   *
   * second try:
   *   15/300 chance: 16-36, 10-14 (tall)
   *  210/300 chance:  8-12, 20-56 (wide)
   *   75/300 chance:  8-12, 10-14 (fallthrough)
   */
  if (tries === 0 && oneIn(15)) {
    height *= 1 + randInt1(2) // 2-3
    width *= 2 + randInt1(3) // 3-5
  } else if (!oneIn(4)) {
    if (oneIn(15)) {
      height *= 2 + randInt0(2) // 2-3
    } else {
      width *= 2 + randInt0(3) // 2-4
    }
  }

  return [height, width]
}
