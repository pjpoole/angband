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
  const outerBox = b.exterior()
  generateRoom(chunk, outerBox, light)
  drawRectangle(chunk, outerBox, FEAT.GRANITE, SQUARE.WALL_OUTER)
  drawFilledRectangle(chunk, b, FEAT.FLOOR, SQUARE.NONE)
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
