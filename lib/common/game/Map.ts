import { Loc } from '../core/loc'
import { Rectangle, stringRectangleToRaster } from '../utilities/rectangle'

import { Tile } from '../world/tile'
import { FEAT, FeatureRegistry } from '../world/features'
import { Entity } from './Entity'

export class GameMap {
  private readonly width: number
  private readonly height: number
  private readonly tiles: Rectangle<Tile>
  private readonly entities: Set<Entity> = new Set()

  constructor(features: FEAT[][]) {
    this.height = features.length
    this.width = features[0].length

    this.tiles = new Rectangle(this.height, this.width, (pt) => {
      const tile = new Tile(pt)
      tile.feature = FeatureRegistry.get(features[pt.y][pt.x])
      return tile
    })
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
      return this.tiles.get(pt).glyph
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
    return this.tiles.get(pt)
  }

  isInbounds(pt: Loc): boolean {
    return pt.x >= 0 && pt.x < this.width && pt.y >= 0 && pt.y < this.height
  }
}
