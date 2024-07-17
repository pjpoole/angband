import { Registry } from '../core/Registry'
import { MonsterBase } from '../monsters/monsterBase'
import { Level } from '../world/level'

export const LevelRegistry = new Registry<Level>(Level)
export const MonsterBaseRegistry = new Registry<MonsterBase>(MonsterBase)
