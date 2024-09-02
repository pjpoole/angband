import { box, Loc } from '../../core/loc'
import { oneIn, randInt0, randInt1 } from '../../core/rand'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { FEAT } from '../features'

import { getNewCenter, SizeParams } from './helpers'
import { buildStarburstRoom } from './helpers/starburst'

const MAX_RETRIES = 1

export function build(
  dungeon: Dungeon,
  chunk: Cave,
  center: Loc,
  rating: number, // not used
): boolean {
  const light = chunk.depth <= randInt1(35)

  let size: SizeParams
  for (let tries = 0; tries <= MAX_RETRIES; tries++) {
    const [height, width] = randomizeRoomSize(tries)

    size = { height, width }

    const newCenter = getNewCenter(dungeon, chunk, center, size)
    if (newCenter != null) {
      center = newCenter
    } else if (tries === MAX_RETRIES) {
      return false
    }
  }

  const { height, width } = size!

  const b = center.box(height, width)

  if (!buildStarburstRoom(chunk, b, light, FEAT.FLOOR, true)) {
    return false
  }

  if (oneIn(10)) {
    const innerWidth = Math.trunc(width / 4)
    const innerHeight = Math.trunc(height / 4)
    const innerBox = box(
      b.l + randInt0(innerWidth),
      b.t + randInt0(innerHeight),
      b.r - randInt0(innerWidth),
      b.b - randInt0(innerHeight),
    )

    buildStarburstRoom(chunk, innerBox, false, FEAT.PASS_RUBBLE, false)
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
