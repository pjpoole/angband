import { Coord } from '../core/coordinate'
import { initRectWith } from '../utilities/rectangle'

import { FEAT, Feature } from './features'
import { SQUARE } from './square'
import { Tile } from './tile'

interface CaveParams {
  height: number
  width: number
  depth: number
}

type FeatureCount = Record<FEAT, number>

// This is going to have significant overlap with GameMap until they're aligned
export class Cave {
  readonly height: number
  readonly width: number
  readonly depth: number

  private readonly tiles: Tile[][]

  // TODO: not space efficient; bitflag
  private readonly featureCount: FeatureCount

  constructor(params: CaveParams) {
    this.width = params.width
    this.height = params.height
    this.depth = params.depth

    this.featureCount = this.initFeatureCount()

    this.tiles = initRectWith(this.height, this.width, (x, y) => {
      const tile = new Tile({ x, y })
      this.featureCount[tile.feature.code] += 1
      return tile
    })
  }

  private initFeatureCount(): FeatureCount {
    const result: Partial<FeatureCount> = {}
    for (const code of Object.values(FEAT)) {
      if (typeof code === 'number') {
        result[code] = 0
      }
    }

    return result as FeatureCount
  }

  fillRectangle(
    p1: Coord,
    p2: Coord,
    feature: Feature,
    flag?: SQUARE,
  ) {
    const [topLeft, bottomRight] = this.wellOrdered(p1, p2)

    const { x: left, y: top } = topLeft
    const { x: right, y: bottom } = bottomRight

    for (let y = top; y <= bottom; y++) {
      for (let x = left; x <= right; x++) {
        const tile = this.tiles[y][x]
        this.setFeature(tile, feature)
        if (flag) tile.turnOn(flag)
      }
    }
  }

  drawRectangle(
    p1: Coord,
    p2: Coord,
    feature: Feature,
    flag?: SQUARE,
    overwritePermanent?: boolean
  ) {
    const [topLeft, bottomRight] = this.wellOrdered(p1, p2)

    const { x: left, y: top } = topLeft
    const { x: right, y: bottom } = bottomRight

    for (const x of [left, right]) {
      for (let y = top; y <= bottom; y++) {
        const tile = this.tiles[y][x]
        if (overwritePermanent || !tile.isPermanent()) {
          this.setFeature(tile, feature)
        }
      }
    }

    for (const y of [top, bottom]) {
      for (let x = left; x <= right; x++) {
        const tile = this.tiles[y][x]
        if (overwritePermanent || !tile.isPermanent()) {
          this.setFeature(tile, feature)
        }
      }
    }

    if (flag) {
      this.generateMark(topLeft, { y: bottom, x: left }, flag)
      this.generateMark({ y: top, x: right }, bottomRight, flag)
      this.generateMark(topLeft, { y: top, x: right }, flag)
      this.generateMark({ y: bottom, x: left }, bottomRight, flag)
    }
  }

  generateMark(
    p1: Coord,
    p2: Coord,
    flag: SQUARE,
  ) {
    const [topLeft, bottomRight] = this.wellOrdered(p1, p2)

    const { x: left, y: top } = topLeft
    const { x: right, y: bottom } = bottomRight

    // TODO: maybe generic iterator? Depends on how often we have to go through
    //       all tiles, or all tiles on a line, or all tiles in a rectangle
    for (let y = top; y <= bottom; y++) {
      for (let x = left; x <= right; x++) {
        const tile = this.tiles[y][x]
        tile.turnOn(flag)
      }
    }
  }

  // this should be the only code setting features
  setFeature(tile: Tile, feature: Feature) {
    this.featureCount[tile.feature.code]--
    this.featureCount[feature.code]++

    tile.feature = feature
    if (feature.isBright()) {
      tile.turnOn(SQUARE.GLOW)
    }
    // TODO: if character_dungeon (what's the alternative?)
    // TODO: traps
    // TODO: square_note_spot
    // TOOD: square_light_spot
  }

  private wellOrdered(pt1: Coord, pt2: Coord): [Coord, Coord] {
    this.assertIsInbounds(pt1)
    this.assertIsInbounds(pt2)

    return [
      { x: Math.min(pt1.x, pt2.x), y: Math.min(pt1.y, pt2.y) },
      { x: Math.max(pt1.x, pt2.x), y: Math.max(pt1.y, pt2.y) },
    ]
  }

  assertIsInbounds(pt: Coord) {
    if (!this.isInbounds(pt)) throw new Error(
      'invalid coordinates',
      { cause: { x: pt.x, y: pt.y }}
    )
  }

  isInbounds(pt: Coord): boolean {
    return pt.x >= 0 && pt.x < this.width && pt.y >= 0 && pt.y < this.height
  }

  isFullyInbounds(pt: Coord): boolean {
    return pt.x > 0 && pt.x < this.width - 1 && pt.y > 0 && pt.y < this.height - 1
  }
}
