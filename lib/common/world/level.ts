import type { GameObject } from '../GameObject'

export interface LevelParams extends GameObject {
  depth: number
  name: string
  up: string | undefined
  down: string | undefined
}

export class Level {
  readonly depth: number
  readonly name: string
  readonly up: string | undefined
  readonly down: string | undefined

  constructor(params: LevelParams) {
    this.depth = params.depth
    this.name = params.name
    this.up = params.up
    this.down = params.down
  }
}
