import { FEAT, Feature, TF } from './features'
import { FeatureRegistry } from '../game/registries'
import { Monster } from '../monsters/monster'

export class Tile {
  private readonly x: number
  private readonly y: number
  private feature: Feature

  light: number = 0
  monster?: Monster
  // objects
  // trap
  // noise
  // smell

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
