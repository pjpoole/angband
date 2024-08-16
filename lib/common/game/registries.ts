import { Registry } from '../core/Registry'
import { MonsterBase } from '../monsters/monsterBase'
import { Projection } from '../spells/Projection'
// import { PlayerProperty } from '../player/properties'
import { DungeonProfile } from '../world/dungeonProfiles'
import { Feature } from '../world/features'
import { Level } from '../world/level'


export const DungeonProfileRegistry = new Registry(DungeonProfile)
export const LevelRegistry = new Registry(Level)
export const ProjectionRegistry = new Registry(Projection)
export const FeatureRegistry = new Registry(Feature)
// export const PlayerPropertyRegistry = new Registry(PlayerProperty)
export const MonsterBaseRegistry = new Registry(MonsterBase)
