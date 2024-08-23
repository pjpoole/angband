import { ActivationParser } from './ActivationParser'
import { ArtifactParser } from './ArtifactParser'
import { BlowParser } from './BlowParser'
import { BrandParser } from './BrandParser'
import { CurseParser } from './CurseParser'
import { DungeonProfileParser } from './DungeonProfileParser'
import { FeatureParser } from './FeatureParser'
import { MonsterBaseParser } from './MonsterBaseParser'
import { MonsterSpellParser } from './MonsterSpellParser'
import { NameParser } from './NameParser'
import { ObjectParser } from './ObjectParser'
import { ObjectBaseParser } from './ObjectBaseParser'
import { PainParser } from './PainParser'
import { PitParser } from './PitParser'
import { PlayerPropertyParser } from './PlayerPropertyParser'
import { ProjectionParser } from './ProjectionParser'
import { RoomTemplateParser } from './RoomTemplateParser'
import { ShapeParser } from './ShapeParser'
import { SlayParser } from './SlayParser'
import { SummonParser } from './SummonParser'
import { VaultParser } from './VaultParser'
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
  NameParser,
  ObjectParser,
  ObjectBaseParser,
  PainParser,
  PitParser,
  PlayerPropertyParser,
  ProjectionParser,
  RoomTemplateParser,
  ShapeParser,
  SlayParser,
  SummonParser,
  VaultParser,
  WorldParser,
}

// TODO: More accurate type information
//       this is just good enough to get loading to work
export const PARSERS: any[] = [
  NameParser,
  RoomTemplateParser,
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
  VaultParser,
  PitParser,
  SummonParser,
  MonsterSpellParser,
  CurseParser,
  WorldParser,
  FeatureParser,
  ObjectParser,
  ArtifactParser,
]
