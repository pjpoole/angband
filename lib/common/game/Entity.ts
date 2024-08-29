import { Loc } from '../core/loc'

import { GameMap } from './Map'

export class Entity {
  protected map?: GameMap
  pt?: Loc

  add(map: GameMap, pt: Loc): boolean {
    this.map = map

    this.pt = pt

    return this.map.addEntity(this)
  }

  remove(): boolean {
    const removed = this.map?.removeEntity(this)
    this.map = undefined
    this.pt = undefined

    return removed || false
  }

  isOnMap(): this is Entity & { map: GameMap; x: number; y: number } {
    return (this.map != null && this.pt != null)
  }

  move(pt: Loc): boolean {
    if (this.isOnMap()) {
      if (this.map.isInbounds(pt)) {
        const tile = this.map.get(pt)
        if (tile == null) return false
        if (!tile.isPassable()) return false

        this.pt = pt
      }
    }

    return false
  }

  get glyph(): string {
    return '@'
  }
}
