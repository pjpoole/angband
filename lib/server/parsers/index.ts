import { BlowParser } from './BlowParser'
import { DungeonProfileParser } from './DungeonProfileParser'
import { WorldParser } from './WorldParser'
import { FeatureParser } from './FeatureParser'
import { ObjectBaseParser } from './ObjectBaseParser'
import { MonsterBaseParser } from './MonsterBaseParser'
import { CurseParser } from './CurseParser'

export { BlowParser } from './BlowParser'
export { CurseParser } from './CurseParser'
export { DungeonProfileParser } from './DungeonProfileParser'
export { FeatureParser } from './FeatureParser'
export { MonsterBaseParser } from './MonsterBaseParser'
export { ObjectBaseParser } from './ObjectBaseParser'
export { WorldParser } from './WorldParser'

// TODO: More accurate type information
// this is just good enough to get loading to work
export const PARSERS: any[] = [
  BlowParser,
  DungeonProfileParser,
  ObjectBaseParser,
  CurseParser,
  MonsterBaseParser,
  WorldParser,
  FeatureParser,
]
