import { type RF } from './flags'
import { type MonsterBase } from './monsterBase'

export interface Monster {
  name: string
  plural?: string
  base: MonsterBase
  glyph?: string // char
  color: string // char; TODO: lookup from colors.js
  speed: number
  hitPoints: number
  light: number
  hearing: number
  armorClass: number
  sleepiness: number
  depth: number
  rarity: number
  experience: number
  blow: string[][] // TODO
  flags: Set<RF>
  flagsOff: Set<RF>
  innateFreq: number
  spellFreq: number
  spellPower: number
  spells: string[][] // TODO
  messageVis: string
  messageInvis: string
  messageMiss: string
  desc: string
  drop: string[][] // TODO
  dropBase: string[][] // TODO
  mimic: [string, string]
  friends: string[][] // TODO
  friendsBase: string[][] // TODO
}
