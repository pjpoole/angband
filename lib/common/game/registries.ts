import { Registry } from '../core/Registry'
import { MonsterBase } from '../monsters/monsterBase'
import { Level } from '../world/level'
import { Projection } from '../spells/Projection'
import { PlayerProperty } from '../player/properties'

export const LevelRegistry = new Registry<Level>(Level)
export const ProjectionRegistry = new Registry<Projection>(Projection)
export const PlayerPropertyRegistry = new Registry<PlayerProperty>(PlayerProperty)
export const MonsterBaseRegistry = new Registry<MonsterBase>(MonsterBase)
