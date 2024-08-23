import { ActivationParser } from './ActivationParser'
import { ArtifactParser } from './ArtifactParser'
import { BlowParser } from './BlowParser'
import { BrandParser } from './BrandParser'
import { CurseParser } from './CurseParser'
import { DungeonProfileParser } from './DungeonProfileParser'
import { FeatureParser } from './FeatureParser'
import { MonsterBaseParser } from './MonsterBaseParser'
import { MonsterSpellParser } from './MonsterSpellParser'
import { ObjectParser } from './ObjectParser'
import { ObjectBaseParser } from './ObjectBaseParser'
import { PainParser } from './PainParser'
import { PitParser } from './PitParser'
import { PlayerPropertyParser } from './PlayerPropertyParser'
import { ProjectionParser } from './ProjectionParser'
import { ShapeParser } from './ShapeParser'
import { SlayParser } from './SlayParser'
import { SummonParser } from './SummonParser'
import { WorldParser } from './WorldParser'

export {
  ActivationParser,
  ArtifactParser,
  BlowParser,
  BrandParser,
  CurseParser,
  DungeonProfileParser,
  FeatureParser,
  MonsterBaseParser,
  MonsterSpellParser,
  ObjectParser,
  ObjectBaseParser,
  PainParser,
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
  PainParser,
  BlowParser,
  BrandParser,
  SlayParser,
  ActivationParser,
  ProjectionParser,
  ShapeParser,
  PlayerPropertyParser,
  DungeonProfileParser,
  ObjectBaseParser,
  MonsterBaseParser,
  // Monster parser must come first
  PitParser,
  SummonParser,
  MonsterSpellParser,
  CurseParser,
  WorldParser,
  FeatureParser,
  ObjectParser,
  ArtifactParser,
]
