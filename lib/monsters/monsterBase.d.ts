import { RF } from './flags'

export interface MonsterBase {
  name: string
  glyph: string // char; TODO: restrict glyph type to one char
  pain: number
  flags: Set<RF>
  desc: string
}
