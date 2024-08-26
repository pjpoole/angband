// This is going to have significant overlap with GameMap until they're aligned

import { FEAT, Feature } from './features'
import { SQUARE } from './square'
import { Tile } from './tile'

interface CaveParams {
  height: number
  width: number
  depth: number
}

export class Cave {
  readonly height: number
  readonly width: number
  readonly depth: number

  private readonly tiles: Tile[][]

  // TODO: not space efficient; bitflag
  private readonly featureCount: Record<FEAT, number>

  constructor(params: CaveParams) {
    this.width = params.width
    this.height = params.height
    this.depth = params.depth

    this.tiles = new Array(this.height)

    const temp: Partial<Record<FEAT, number>> = {}
    for (const code of Object.values(FEAT)) {
      if (typeof code === 'number') {
        temp[code] = 0
      }
    }

    this.featureCount = temp as typeof this.featureCount

    for (let y = 0; y < this.height; y++) {
      this.tiles[y] = new Array(this.width)
      for (let x = 0; x < this.width; x++) {
        this.tiles[y][x] = new Tile(x, y)
        this.featureCount[this.tiles[y][x].feature.code]! += 1
      }
    }
  }

  fillRectangle(
    startX: number,
    startY: number,
    stopX: number,
    stopY: number,
    feature: Feature,
    flag?: SQUARE,
  ) {
    this.assertIsInbounds(startX, startY)
    this.assertIsInbounds(stopX, stopY)

    for (let y = startY; y <= stopY; y++) {
      for (let x = startX; x <= stopX; x++) {
        const tile = this.tiles[y][x]
        this.setFeature(tile, feature)
        if (flag) tile.turnOn(flag)
      }
    }
  }

  drawRectangle(
    startX: number,
    startY: number,
    stopX: number,
    stopY: number,
    feature: Feature,
    flag?: SQUARE,
    overwritePermanent?: boolean
  ) {
    this.assertIsInbounds(startX, startY)
    this.assertIsInbounds(stopX, stopY)

    for (const x of [startX, stopX]) {
      for (let y = startY; y <= stopY; y++) {
        const tile = this.tiles[y][x]
        if (overwritePermanent || tile.isPermanent()) {
          this.setFeature(tile, feature)
        }
      }
    }

    if (flag) {
      this.generateMark(startX, startY, startX, stopY, flag)
      this.generateMark(stopX, startY, stopX, stopY, flag)
    }


    for (const y of [startY, stopY]) {
      for (let x = startX; x <= stopX; x++) {
        const tile = this.tiles[y][x]
        if (overwritePermanent || tile.isPermanent()) {
          this.setFeature(tile, feature)
        }
      }
    }

    if (flag) {
      this.generateMark(startX, startY, stopX, startY, flag)
      this.generateMark(startX, stopY, stopX, stopY, flag)
    }
  }

  generateMark(
    startX: number,
    startY: number,
    stopX: number,
    stopY: number,
    flag: SQUARE,
  ) {
    this.assertIsInbounds(startX, startY)
    this.assertIsInbounds(stopX, stopY)

    // TODO: maybe generic iterator? Depends on how often we have to go through
    //       all tiles, or all tiles on a line, or all tiles in a rectangle
    for (let y = startY; y <= stopY; y++) {
      for (let x = startX; x <= stopX; x++) {
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

  assertIsInbounds(x: number, y: number) {
    if (!this.isInbounds(x, y)) throw new Error(
      'invalid coordinates',
      { cause: { x, y }}
    )
  }

  isInbounds(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height
  }

  isFullyInbounds(x: number, y: number): boolean {
    return x > 0 && x < this.width - 1 && y > 0 && y < this.height - 1
  }
}
