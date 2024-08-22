import { BlowParser } from './BlowParser'
import { CurseParser } from './CurseParser'
import { DungeonProfileParser } from './DungeonProfileParser'
import { FeatureParser } from './FeatureParser'
import { MonsterBaseParser } from './MonsterBaseParser'
import { ObjectParser } from './ObjectParser'
import { ObjectBaseParser } from './ObjectBaseParser'
import { PitParser } from './PitParser'
import { PlayerPropertyParser } from './PlayerPropertyParser'
import { ProjectionParser } from './ProjectionParser'
import { ShapeParser } from './ShapeParser'
import { SlayParser } from './SlayParser'
import { SummonParser } from './SummonParser'
import { WorldParser } from './WorldParser'

export {
  BlowParser,
  CurseParser,
  DungeonProfileParser,
  FeatureParser,
  MonsterBaseParser,
  ObjectParser,
  ObjectBaseParser,
  PitParser,
  PlayerPropertyParser,
  ProjectionParser,
  ShapeParser,
  SlayParser,
  SummonParser,
  WorldParser,
}

// TODO: More accurate type information
//       this is just good enough to get loading to work
export const PARSERS: any[] = [
  BlowParser,
  SlayParser,
  ProjectionParser,
  ShapeParser,
  PlayerPropertyParser,
  DungeonProfileParser,
  ObjectBaseParser,
  MonsterBaseParser,
  // Monster parser must come first
  PitParser,
  SummonParser,
  CurseParser,
  WorldParser,
  FeatureParser,
  ObjectParser,
]
