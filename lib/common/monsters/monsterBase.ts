import { RF } from './flags'
import { GameObject } from '../GameObject'

export interface MonsterBaseParams extends GameObject {
  name: string
  glyph: string // char; TODO: restrict glyph type to one char
  pain: number
  flags: Set<RF>
  desc: string
}

export class MonsterBase {
  readonly name: string
  readonly glyph: string
  readonly pain: number
  readonly flags: Set<RF>
  readonly description: string

  constructor(params: MonsterBaseParams) {
    this.name = params.name
    this.glyph = params.glyph
    this.pain = params.pain
    this.flags = params.flags
    this.description = params.desc
  }
}
