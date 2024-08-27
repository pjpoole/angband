import { Coord } from '../core/coordinate'
import { Rectangle } from '../utilities/rectangle'

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

  private readonly tiles: Rectangle<Tile>

  // TODO: not space efficient; bitflag
  private readonly featureCount: FeatureCount

  constructor(params: CaveParams) {
    this.width = params.width
    this.height = params.height
    this.depth = params.depth

    this.featureCount = this.initFeatureCount()

    this.tiles = new Rectangle(this.width, this.height, (pt: Coord): Tile => {
      const tile = new Tile(pt, params.fill, params.flag)
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
    this.tiles.eachCellInRange(p1, p2, (tile: Tile) => {
      this.setFeature(tile, feature)
      if (flag) tile.turnOn(flag)
    })
  }

  drawRectangle(
    p1: Coord,
    p2: Coord,
    feature: Feature,
    flag?: SQUARE,
    overwritePermanent?: boolean
  ) {
    this.tiles.eachBorderCell(p1, p2, (tile) => {
      if (overwritePermanent || !tile.isPermanent()) {
        this.setFeature(tile, feature)
      }
      if (flag) tile.turnOn(flag)
    })
  }

  generateMark(
    p1: Coord,
    p2: Coord,
    flag: SQUARE,
  ) {
    this.tiles.eachCellInRange(p1, p2, (tile) => { tile.turnOn(flag) })
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

  isInbounds(pt: Coord) {
    return this.tiles.isInbounds(pt)
  }

  isFullyInbounds(pt: Coord) {
    return this.tiles.isFullyInbounds(pt)
  }
}
