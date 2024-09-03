import { Box, Loc } from '../../core/loc'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'

export interface DimensionGeneratingParams {
  depth: number
  height?: number
  width?: number
}

export interface CaveGeneratorParams {
  height: number
  width: number
  depth: number
  padding?: number
}

export class RoomGeneratorBase {
  height: number
  width: number
  readonly depth: number
  padding: number = 2

  constructor(params: CaveGeneratorParams) {
    this.height = params.height
    this.width = params.width
    this.depth = params.depth
    if (params.padding) this.padding = params.padding
  }

  draw(dungeon: Dungeon, cave: Cave, center: Loc): boolean {
    const newCenter = this.validateCenter(dungeon, cave, center)
    if (newCenter == null) return false
    center = newCenter

    const chunk = this.build()

    if (chunk == null) return false

    cave.composite(chunk, center.box(this.height, this.width))

    return true
  }

  build(): Cave | null {
    throw new Error('implement in subclass')
  }

  protected validateCenter(dungeon: Dungeon, cave: Cave, center: Loc): Loc | null {
    if (!cave.isInbounds(center)) {
      const newCenter = dungeon.findSpace(this.getSpaceBox(center))
      return newCenter ?? null
    }
    return center
  }

  protected getSpaceBox(center: Loc): Box {
    return center.box(this.height + this.padding, this.width + this.padding)
  }

  protected getNewCave(): Cave {
    return new Cave({
      height: this.height,
      width: this.width,
      depth: this.depth,
    })
  }
}
