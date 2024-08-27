import { doInit } from './init'

import ary from '../../gamedata/monster_base.json'
import { MonsterBase as cls, MonsterBaseRegistry as registry } from '../monsters/monsterBase'

export function init() {
  doInit(registry, cls, ary)
}
