import { FEAT, Feature, TF } from '../world/features'
import { FeatureRegistry } from './registries'

export class Tile {
  private readonly x: number
  private readonly y: number
  private feature: Feature

  constructor(x: number, y: number, feature: FEAT) {
    this.x = x
    this.y = y

    this.feature = FeatureRegistry.get(feature)
  }

  get glyph(): string {
    return this.feature.glyph
  }

  isPassable(): boolean {
    return this.feature.flags.has(TF.PASSABLE)
  }
}
