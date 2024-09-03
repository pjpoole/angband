import { Box, box, loc, Loc } from '../../core/loc'
import { mBonus, oneIn, randInRange, randInt0, randInt1 } from '../../core/rand'
import { getNeighbors } from '../../utilities/directions'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { FEAT } from '../features'
import { SQUARE } from '../square'

import { drawFilledRectangle } from './helpers/geometry'
import { hollowRoom } from './helpers/room'
import { DimensionGeneratingParams, RoomGeneratorBase } from './RoomGenerator'

export function build(
  dungeon: Dungeon,
  cave: Cave,
  center: Loc,
  rating: number,
): boolean {
  const generator = new RoomOfChambersGenerator({ depth: cave.depth })
  return generator.draw(dungeon, cave, center)
}

export class RoomOfChambersGenerator extends RoomGeneratorBase {
  constructor(params: DimensionGeneratingParams) {
    const depth = params.depth
    const height = 20 + mBonus(20, depth)
    const width = 20 + randInt1(20) + mBonus(20, depth)

    super({ height, width, depth, padding: 0 })
  }

  build(): Cave | null {
    const chunk = this.getNewCave()
    const center = chunk.box.center()
    const { height, width } = this

    const b = box(
      center.x - Math.trunc(width / 2),
      center.y - Math.trunc(height / 2),
      center.x + Math.trunc((width - 1) / 2),
      center.y + Math.trunc((height - 1) / 2),
    )

    if (!chunk.surrounds(b)) return null

    const light = chunk.depth < randInt0(45)

    const bdx = (b.right - b.left)
    const bdy = (b.top - b.bottom)

    // We don't use size to preserve coded behavior
    const area = bdx * bdy

    const countChambers = 10 + Math.trunc(area / 80)

    for (let i = 0; i < countChambers; i++) {
      const size = randInRange(3, 7)
      const width = size + randInt0(10)
      const height = size + randInt0(4)

      const top = randInt0(1 + bdy - height)
      const left = randInt0(1 + bdx - width)

      const bottom = Math.min(top + height, b.b)
      const right = Math.min(left + width, b.r)

      const b1 = box(left, top, right, bottom)

      makeChamber(chunk, b1)
    }

    for (const p of b) {
      if (!chunk.isFullyInbounds(p)) continue

      let count = 0

      for (const p1 of getNeighbors(p)) {
        const t1 = chunk.get(p1)
        if (
          t1.is(FEAT.GRANITE) &&
          t1.isWallOuter() &&
          t1.isWallSolid()
        ) count++
      }
      const tile = chunk.get(p)
      if (count === 5 && !tile.is(FEAT.MAGMA)) {
        chunk.setMarkedGranite(p, SQUARE.WALL_INNER)
      } else if (count > 5) {
        chunk.setMarkedGranite(p, SQUARE.WALL_INNER)
      }
    }

    let p1
    for (let i = 0; i < 50; i++) {
      p1 = loc(
        b.left + Math.trunc(bdx / 4) + randInt0(Math.trunc(bdx / 2)),
        b.right + Math.trunc(bdy / 4) + randInt0(Math.trunc(bdy / 2))
      )
      if (chunk.get(p1).is(FEAT.MAGMA)) break
    }
    // sacrifice to the typescript gods
    if (p1 == null) throw new Error('no point selected')

    const tile = chunk.get(p1)
    chunk.setFeature(tile, FEAT.FLOOR)
    hollowRoom(chunk, p1!)

    return chunk
  }
}

function makeChamber(chunk: Cave, b: Box) {
  drawFilledRectangle(chunk, b.interior(), FEAT.MAGMA, SQUARE.NONE)

  for (const pt of b.borders()) {
    makeInnerChamberWall(chunk, pt)
  }

  const bdx = b.right - b.left
  const bdy = b.bottom - b.top

  for (let i = 0; i < 20; i++) {
    let p1
    if (oneIn(2)) {
      p1 = loc(
        oneIn(2) ? b.left : b.right,
        b.top + randInt0(1 + bdy)
      )
    } else {
      p1 = loc(
        b.left + randInt0(1 + bdx),
        oneIn(2) ? b.top : b.bottom
      )
    }

    if (!chunk.get(p1).isWallInner()) continue
    if (!chunk.isInbounds(p1)) continue

    let innerWalls = 0
    let tiles = 0
    for (const p2 of getNeighbors(p1, true)) {
      tiles++
      const tile = chunk.get(p2)
      if (tile.is(FEAT.OPEN)) break
      if (tile.isWallInner()) innerWalls++
      if (innerWalls > 3) break
      if (tiles === 8) {
        chunk.setFeature(tile, FEAT.OPEN)
        return
      }
    }
  }
}

function makeInnerChamberWall(chunk: Cave, p: Loc) {
  const tile = chunk.get(p)
  if (!tile.is(FEAT.GRANITE) && !tile.is(FEAT.MAGMA)) return
  if (tile.isWallOuter()) return
  if (tile.isWallSolid()) return
  chunk.setMarkedGranite(p, SQUARE.WALL_INNER)
}
