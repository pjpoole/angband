// This is going to have significant overlap with GameMap until they're aligned

import { FEAT, Feature } from './features'
import { SQUARE } from './square'
import { Tile } from './tile'

interface CaveParams {
  height: number
  width: number
}

export class Cave {
  private readonly height: number
  private readonly width: number

  private readonly tiles: Tile[][]

  // TODO: not space efficient; bitflag
  private readonly featureCount: Partial<Record<FEAT, number>> = {}

  constructor(params: CaveParams) {
    this.width = params.width
    this.height = params.height

    this.tiles = new Array(this.height)

    for (let y = 0; y < this.height; y++) {
      this.tiles[y] = new Array(this.width)
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
          tile.feature = feature
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
          tile.feature = feature
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
    // TODO: maybe generic iterator? Depends on how often we have to go through
    //       all tiles, or all tiles on a line, or all tiles in a rectangle
    for (let y = startY; y <= stopY; y++) {
      for (let x = startX; x <= stopX; x++) {
        const tile = this.tiles[y][x]
        tile.turnOn(flag)
      }
    }
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
