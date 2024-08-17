import { NameRegistry, IdRegistry } from '../core/Registry'
import { MonsterBase } from '../monsters/monsterBase'
import { Projection } from '../spells/Projection'
// import { PlayerProperty } from '../player/properties'
import { DungeonProfile } from '../world/dungeonProfiles'
import { Feature } from '../world/features'
import { Level } from '../world/level'


export const DungeonProfileRegistry = new IdRegistry(DungeonProfile)
export const LevelRegistry = new IdRegistry(Level)
export const ProjectionRegistry = new IdRegistry(Projection)
export const FeatureRegistry = new IdRegistry(Feature)
// export const PlayerPropertyRegistry = new IdRegistry(PlayerProperty)
export const MonsterBaseRegistry = new NameRegistry(MonsterBase)
