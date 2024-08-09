import { Registry } from '../core/Registry'
import { MonsterBase } from '../monsters/monsterBase'
import { Level } from '../world/level'
import { Projection } from '../spells/Projection'
import { PlayerProperty } from '../player/properties'
import { Feature } from '../world/features'

// export const LevelRegistry = new Registry(Level)
export const ProjectionRegistry = new Registry(Projection)
export const FeatureRegistry = new Registry(Feature)
// export const PlayerPropertyRegistry = new Registry(PlayerProperty)
export const MonsterBaseRegistry = new Registry(MonsterBase)
