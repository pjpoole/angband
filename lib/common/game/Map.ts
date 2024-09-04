import { Loc } from '../core/loc'
import { Rectangle, stringRectangleToRaster } from '../utilities/rectangle'

import { Cave } from '../world/cave'
import { Tile } from '../world/tile'
import { Entity } from './Entity'

export class GameMap {
  private readonly cave: Cave
  private readonly entities: Set<Entity> = new Set()

  constructor(cave: Cave) {
    this.cave = cave
  }

  get height() {
    return this.cave.height
  }

  get width() {
    return this.cave.width
  }

  get tiles() {
    return this.cave.tiles
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
    const rect = new Rectangle(this.height, this.width, (pt) => {
      return this.cave.tiles.get(pt).glyph
    })

    for (const entity of this.entities) {
      if (entity.isOnMap()) {
        rect.set(entity.pt!, entity.glyph)
      }
    }

    return stringRectangleToRaster(rect)
  }

  get(pt: Loc): Tile | undefined {
    if (!this.isInbounds(pt)) {
      return undefined
    }
    return this.cave.tiles.get(pt)
  }

  isInbounds(pt: Loc): boolean {
    return pt.x >= 0 && pt.x < this.width && pt.y >= 0 && pt.y < this.height
  }
}
