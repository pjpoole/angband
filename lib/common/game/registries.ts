import { NameRegistry, IdRegistry } from '../core/Registry'

import { Blow } from '../monsters/blows'
import { MonsterBase } from '../monsters/monsterBase'
import { Curse } from '../objects/curse'
import { ObjectBase } from '../objects/objectBase'
// import { PlayerProperty } from '../player/properties'
import { Projection } from '../spells/Projection'
import { Summon } from '../spells/summons'
import { DungeonProfile } from '../world/dungeonProfiles'
import { Feature } from '../world/features'
import { Level } from '../world/level'

export const BlowRegistry = new NameRegistry(Blow)
export const CurseRegistry = new NameRegistry(Curse)
export const DungeonProfileRegistry = new IdRegistry(DungeonProfile)
export const FeatureRegistry = new IdRegistry(Feature)
export const LevelRegistry = new IdRegistry(Level)
export const MonsterBaseRegistry = new NameRegistry(MonsterBase)
export const ObjectBaseRegistry = new NameRegistry(ObjectBase)
// export const PlayerPropertyRegistry = new IdRegistry(PlayerProperty)
export const ProjectionRegistry = new IdRegistry(Projection)
export const SummonRegistry = new NameRegistry(Summon)
