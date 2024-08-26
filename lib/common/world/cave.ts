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

  }
}
