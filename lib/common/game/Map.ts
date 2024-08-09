import { Tile } from './Tile'
import { FEAT } from '../world/features'

export class GameMap {
  private readonly width: number
  private readonly height: number
  private readonly tiles: Tile[][]

  constructor(features: FEAT[][]) {
    this.width = features.length
    this.height = features[0].length

    this.tiles = new Array(this.height)

    for (let y = 0; y < this.height; y++) {
      this.tiles[y] = new Array(this.width)
      for (let x = 0; x < this.width; x++) {
        this.tiles[y][x] = new Tile(x, y, features[y][x])
      }
    }
  }

  draw(): string {
    return this.tiles
      .map(row => {
        return row.map(tile => tile.glyph).join('')
      })
      .join('\n')
  }
}
