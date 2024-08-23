import { ActivationParser } from './ActivationParser'
import { ArtifactParser } from './ArtifactParser'
import { BlowParser } from './BlowParser'
import { BrandParser } from './BrandParser'
import { CurseParser } from './CurseParser'
import { DungeonProfileParser } from './DungeonProfileParser'
import { EgoItemParser } from './EgoItemParser'
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

import { Registry } from '../../common/core/Registry'

import {
  ActivationRegistry,
  AngbandObjectRegistry,
  ArtifactRegistry,
  BlowRegistry,
  BrandRegistry,
  CurseRegistry,
  DungeonProfileRegistry,
  EgoItemRegistry,
  FeatureRegistry,
  LevelRegistry,
  MonsterBaseRegistry,
  MonsterSpellRegistry,
  NamesRegistry,
  ObjectBaseRegistry,
  PainRegistry,
  PitRegistry,
  PlayerPropertyRegistry,
  ProjectionRegistry,
  RoomTemplateRegistry,
  ShapeRegistry,
  SlayRegistry,
  SummonRegistry,
  VaultRegistry,
} from '../../common/game/registries'

export {
  ActivationParser,
  ArtifactParser,
  BlowParser,
  BrandParser,
  CurseParser,
  DungeonProfileParser,
  EgoItemParser,
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
export const PARSERS: [any, Registry<any, any, any>][] = [
  [NameParser, NamesRegistry],
  [RoomTemplateParser, RoomTemplateRegistry],
  [PainParser, PainRegistry],
  [BlowParser, BlowRegistry],
  [BrandParser, BrandRegistry],
  [SlayParser, SlayRegistry],
  [ActivationParser, ActivationRegistry],
  [ProjectionParser, ProjectionRegistry],
  [ShapeParser, ShapeRegistry],
  [PlayerPropertyParser, PlayerPropertyRegistry],
  [DungeonProfileParser, DungeonProfileRegistry],
  [ObjectBaseParser, ObjectBaseRegistry],
  [MonsterBaseParser, MonsterBaseRegistry],
  [VaultParser, VaultRegistry],
  [PitParser, PitRegistry],
  [SummonParser, SummonRegistry],
  [MonsterSpellParser, MonsterSpellRegistry],
  [CurseParser, CurseRegistry],
  [WorldParser, LevelRegistry],
  [FeatureParser, FeatureRegistry],
  [ObjectParser, AngbandObjectRegistry],
  [ArtifactParser, ArtifactRegistry],
  [EgoItemParser, EgoItemRegistry],
]
