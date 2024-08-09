import { GameMap } from './Map'

export class Entity {
  protected map?: GameMap
  x?: number
  y?: number

  add(map: GameMap, x: number, y: number): boolean {
    this.map = map

    this.x = x
    this.y = y

    return this.map.addEntity(this)
  }

  remove(): boolean {
    const removed = this.map?.remoteEntity(this)
    this.map = undefined
    this.x = undefined
    this.y = undefined

    return removed || false
  }

  isOnMap(): this is Entity & { map: GameMap; x: number; y: number } {
    return (this.map != null && this.x != null && this.y != null)
  }

  move(x: number, y: number): boolean {
    if (this.isOnMap()) {
      if (this.map.isInbounds(x, y)) {
        const tile = this.map.get(x, y)
        if (tile == null) return false
        if (!tile.isPassable()) return false

        this.x = x
        this.y = y
      }
    }

    return false
  }

  get glyph(): string {
    return '@'
  }
}
