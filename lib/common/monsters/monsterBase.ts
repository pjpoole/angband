import { RF } from './flags'
import { GameObject } from '../GameObject'

interface MonsterBaseParams extends GameObject {
  name: string
  glyph: string // char; TODO: restrict glyph type to one char
  pain: number
  flags: Set<RF>
  desc: string
}

export class MonsterBase {
  name: string
  glyph: string
  pain: number
  flags: Set<RF>
  description: string

  constructor(params: MonsterBaseParams) {
    this.name = params.name
    this.glyph = params.glyph
    this.pain = params.pain
    this.flags = params.flags
    this.description = params.desc
  }
}
