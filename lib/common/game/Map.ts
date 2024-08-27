import { Tile } from '../world/tile'
import { FEAT, FeatureRegistry } from '../world/features'
import { Entity } from './Entity'
import { Coord } from '../core/coordinate'

export class GameMap {
  private readonly width: number
  private readonly height: number
  private readonly tiles: Tile[][]
  private readonly entities: Set<Entity> = new Set()

  constructor(features: FEAT[][]) {
    this.height = features.length
    this.width = features[0].length

    this.tiles = new Array(this.height)

    for (let y = 0; y < this.height; y++) {
      this.tiles[y] = new Array(this.width)
      for (let x = 0; x < this.width; x++) {
        this.tiles[y][x] = new Tile({ x, y })
        this.tiles[y][x].feature = FeatureRegistry.get(features[y][x])
      }
    }
  }

  addEntity(entity: Entity): boolean {
    if (this.entities.has(entity)) return false
    if (entity.pt == null) return false
    if (!this.isInbounds(entity.pt)) return false

    this.entities.add(entity)

    return true
  }

  removeEntity(entity: Entity): boolean {
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

  get(pt: Coord): Tile | undefined {
    if (!this.isInbounds(pt)) {
      return undefined
    }
    const { x, y } = pt
    return this.tiles[y][x]
  }

  isInbounds(pt: Coord): boolean {
    return pt.x >= 0 && pt.x < this.width && pt.y >= 0 && pt.y < this.height
  }
}
