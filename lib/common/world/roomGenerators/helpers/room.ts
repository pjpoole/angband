import { Box, Loc, loc } from '../../../core/loc'
import { Rectangle } from '../../../utilities/rectangle'

import { Cave } from '../../cave'
import { SQUARE } from '../../square'
import { FEAT, Feature } from '../../features'

import { drawRectangle, drawFilledRectangle } from './geometry'

export function generateBasicRoom(
  chunk: Cave,
  b: Box,
  light: boolean,
): void {
  const innerBox = b.interior()
  generateRoom(chunk, b, light)
  drawRectangle(chunk, b, FEAT.GRANITE, SQUARE.WALL_OUTER)
  drawFilledRectangle(chunk, innerBox, FEAT.FLOOR, SQUARE.NONE)
}

// Same contents as generateBasicRoom, but interleaved
// This ensures that the walls won't overlap the floors
export function generateOverlapRooms(
  chunk: Cave,
  b1: Box,
  b2: Box,
  light: boolean,
): void {
  const innerA = b1.interior()
  const innerB = b2.interior()

  generateRoom(chunk, b1, light)
  generateRoom(chunk, b2, light)
  drawRectangle(chunk, b1, FEAT.GRANITE, SQUARE.WALL_OUTER)
  drawRectangle(chunk, b2, FEAT.GRANITE, SQUARE.WALL_OUTER)
  drawFilledRectangle(chunk, innerA, FEAT.FLOOR, SQUARE.NONE)
  drawFilledRectangle(chunk, innerB, FEAT.FLOOR, SQUARE.NONE)
}

export function generateRoom(chunk: Cave, b: Box, light: boolean) {
  chunk.tiles.forEach(b, (tile) => {
    tile.turnOn(SQUARE.ROOM)
    if (light) tile.turnOn(SQUARE.GLOW)
  })
}

export function generateRoomFeature(
  chunk: Cave,
  b: Box,
  feature: Feature | FEAT,
  flag?: SQUARE,
  light?: boolean,
) {
  chunk.tiles.forEach(b, (tile) => {
    chunk.setFeature(tile, feature)
    if (flag) tile.turnOn(flag)

    tile.turnOn(SQUARE.ROOM)
    if (light) tile.turnOn(SQUARE.GLOW)
  })
}

export function setBorderingWalls(chunk: Cave, b: Box) {
  const clipped = chunk.tiles.intersect(b)
  const topLeft = loc(clipped.left, clipped.top)

  const refToOffset = (p: Loc): Loc => p.diff(topLeft)
  const offsetToRef = (p: Loc): Loc => p.sum(topLeft)

  const walls = new Rectangle(b.height, b.width, true)

  chunk.tiles.forEach(clipped, (tile, pt) => {
    if (!tile.isFloor()) {
      assert(!tile.isRoom())
      return
    }

    assert(tile.isRoom())

    const neighbors = chunk.tiles.intersect(pt.box(3))

    if (neighbors.height !== 3 || neighbors.width !== 3) {
      // we hit the edge of the map
      walls.set(refToOffset(pt), true)
    } else {
      let floorCount = 0
      chunk.tiles.forEach(neighbors, (tile) => {
        const isFloor = tile.isFloor()
        assert(isFloor === tile.isRoom())
        if (isFloor) floorCount++
      })

      if (floorCount != 9) {
        walls.set(refToOffset(pt), true)
      }
    }
  })

  walls.forEach((val, pt) => {
    if (val) {
      const offset = offsetToRef(pt)
      const tile = chunk.tiles.get(offset)
      assert(tile.isFloor() && tile.isRoom())
      chunk.setMarkedGranite(offset, SQUARE.WALL_OUTER)
    }
  })
}

export function hollowRoom(chunk: Cave, pt: Loc) {
  for (const p of pt.box(3)) {
    const tile = chunk.tiles.get(p)
    if (tile.is(FEAT.MAGMA)) {
      chunk.setFeature(tile, FEAT.FLOOR)
      hollowRoom(chunk, p)
    } else if (tile.is(FEAT.OPEN)) {
      chunk.setFeature(tile, FEAT.BROKEN)
      hollowRoom(chunk, p)
    }
  }
}
