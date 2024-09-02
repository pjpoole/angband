import { Box, Loc } from '../../core/loc'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'

export interface SizeParams {
  height: number
  width: number
  padding?: number
}

export interface CaveGenerationParams {
  height: number
  width: number
  depth: number
}

export function getSpaceBox(center: Loc, size: SizeParams): Box {
  const padding = size.padding ?? 2
  return center.box(size.height + padding, size.width + padding)
}

export function getNewCenter(dungeon: Dungeon, chunk: Cave, center: Loc, size: SizeParams): Loc | null {
  if (!chunk.isInbounds(center)) {
    const newCenter = dungeon.findSpace(getSpaceBox(center, size))
    return newCenter ?? null
  }
  return center
}
