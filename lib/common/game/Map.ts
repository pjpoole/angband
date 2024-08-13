import { Tile } from './Tile'
import { FEAT } from '../world/features'
import { Entity } from './Entity'

export class GameMap {
  private readonly width: number
  private readonly height: number
  private readonly tiles: Tile[][]
  private readonly entities: Set<Entity> = new Set()

  constructor(features: (keyof typeof FEAT)[][]) {
    this.height = features.length
    this.width = features[0].length

    this.tiles = new Array(this.height)

    for (let y = 0; y < this.height; y++) {
      this.tiles[y] = new Array(this.width)
      for (let x = 0; x < this.width; x++) {
        this.tiles[y][x] = new Tile(x, y, features[y][x])
      }
    }
  }

  addEntity(entity: Entity): boolean {
    if (this.entities.has(entity)) return false
    if (entity.x == null || entity.y == null) return false
    if (!this.isInbounds(entity.x, entity.y)) return false

    this.entities.add(entity)

    return true
  }

  remoteEntity(entity: Entity): boolean {
    return this.entities.delete(entity)
  }

  draw(): string {
    const result = new Array(this.height)

    for (let y = 0; y < this.height; y++) {
      result[y] = new Array(this.width)
      for (let x = 0; x < this.width; x++) {
        result[y][x] = this.tiles[y][x].glyph
      }
    }

    for (const entity of this.entities) {
      if (entity.isOnMap()) {
        result[entity.y][entity.x] = entity.glyph
      }
    }

    return result.map(row => row.join('')).join('\n')
  }

  get(x: number, y: number): Tile | undefined {
    if (!this.isInbounds(x, y)) {
      return undefined
    }
    return this.tiles[y][x]
  }

  isInbounds(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.width
  }
}
