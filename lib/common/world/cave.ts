import { Box, Loc } from '../core/loc'

import { getAllNeighbors } from '../utilities/directions'
import { Rectangle } from '../utilities/rectangle'

import { FEAT, Feature, FeatureRegistry } from './features'
import { SQUARE } from './square'
import { Tile } from './tile'

// are we currently building the dungeon?
let characterDungeon = false

interface CaveParams {
  height: number
  width: number
  depth: number
  fill?: Feature | FEAT
  border?: Feature | FEAT
  flag?: SQUARE
}

type FeatureCount = Record<FEAT, number>

// This is going to have significant overlap with GameMap until they're aligned
export class Cave {
  readonly height: number
  readonly width: number
  readonly depth: number

  readonly fill?: Feature

  readonly tiles: Rectangle<Tile>

  private readonly featureCount: FeatureCount

  constructor(params: CaveParams) {
    this.width = params.width
    this.height = params.height
    this.depth = params.depth

    this.featureCount = this.initFeatureCount()

    this.fill = params.fill !== null && typeof params.fill === 'number'
      ? FeatureRegistry.get(params.fill)
      : params.fill

    this.tiles = new Rectangle(this.height, this.width, (pt: Loc): Tile => {
      const tile = new Tile(pt, this.fill, params.flag)
      this.featureCount[tile.feature.code] += 1
      return tile
    })

    if (params.border) {
      const border = typeof params.border === 'number'
        ? FeatureRegistry.get(params.border)
        : params.border

      this.tiles.forEachBorder((tile) => { this.setFeature(tile, border) })
    }
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

  get box() {
    return this.tiles.box
  }

  get(p: Loc): Tile {
    return this.tiles.get(p)
  }

  // previously known as generateMark
  turnOnBox(
    b: Box,
    flag: SQUARE,
  ) {
    this.tiles.forEach(b, (tile) => { tile.turnOn(flag) })
  }

  turnOn(p: Loc, flag: SQUARE) {
    this.tiles.get(p).turnOn(flag)
  }

  turnOff(p: Loc, flag: SQUARE) {
    this.tiles.get(p).turnOff(flag)
  }

  composite(chunk: Cave, b: Box, rotate?: number, reflect?: boolean) {
    this.tiles.assertSurrounds(b)
    chunk.tiles.transform({ translate: b.topLeft, rotate, reflect }, (tile, pt) => {
      // empty spaces don't get written onto our map; we treat them as undefined
      if (tile.is(FEAT.NONE)) return
      this.copyTile(tile, pt)
    })
  }

  static from(cave: Cave): Cave {
    return new Cave({
      height: cave.height,
      width: cave.width,
      depth: cave.depth,
      fill: cave.fill,
    })
  }

  static copy(cave: Cave): Cave {
    const copy = Cave.from(cave)

    cave.tiles.forEach((tile, pt) => {
      copy.copyTile(tile, pt)
    })

    return copy
  }

  setMarkedGranite(pt: Loc, flag?: SQUARE) {
    const tile = this.tiles.get(pt)
    this.setFeature(tile, FEAT.GRANITE)
    if (flag) tile.turnOn(flag)
  }

  copyTile(tile: Tile, pt: Loc) {
    const current = this.tiles.get(pt)
    this.featureCount[current.feature.code]--
    this.featureCount[tile.feature.code]++

    this.tiles.get(pt).copy(tile)
  }

  // this should be the only code setting features
  setFeature(tile: Tile, _feature: Feature | FEAT) {
    const feature = typeof _feature === 'number' ? FeatureRegistry.get(_feature) : _feature

    this.featureCount[tile.feature.code]--
    this.featureCount[feature.code]++

    tile.feature = feature
    if (feature.isBright()) {
      tile.turnOn(SQUARE.GLOW)
    }

    if (characterDungeon) {
      // TODO: traps
      // TODO: square_note_spot
      // TODO: square_light_spot
    } else {
      tile.turnOff(SQUARE.WALL_INNER)
      tile.turnOff(SQUARE.WALL_OUTER)
      tile.turnOff(SQUARE.WALL_SOLID)
    }
  }

  hasLOS(p1: Loc, p2: Loc): boolean {
    // TODO: Implement
    return true
  }

  findNearbyGrid(bounds: Box): Loc | undefined {
    for (const p of this.tiles.randomly(bounds)) {
      if (this.isFullyInbounds(p)) return p
    }
  }

  countNeighbors(pt: Loc, countSelf: boolean, fn: (tile: Tile, pt: Loc, chunk: this) => boolean) {
    let count = 0

    for (const neighbor of getAllNeighbors(pt, countSelf)) {
      if (!this.isInbounds(neighbor)) continue
      const tile = this.tiles.get(neighbor)
      if (!fn(tile, neighbor, this)) continue

      count++
    }

    return count
  }

  surrounds(b: Box): boolean {
    return this.box.surrounds(b)
  }

  isInbounds(pt: Loc) {
    return this.tiles.contains(pt)
  }

  isFullyInbounds(pt: Loc) {
    return this.tiles.fullyContains(pt)
  }
}
