import { BlowParser } from './BlowParser'
import { CurseParser } from './CurseParser'
import { DungeonProfileParser } from './DungeonProfileParser'
import { FeatureParser } from './FeatureParser'
import { ObjectBaseParser } from './ObjectBaseParser'
import { MonsterBaseParser } from './MonsterBaseParser'
import { WorldParser } from './WorldParser'

export {
  BlowParser,
  CurseParser,
  DungeonProfileParser,
  FeatureParser,
  MonsterBaseParser,
  ObjectBaseParser,
  WorldParser,
}


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
