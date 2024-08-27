import { doInit } from './init'

import ary from '../../gamedata/monster_base.json'
import { MonsterBase as cls, MonsterBaseRegistry as registry } from '../monsters/monsterBase'

import { init as initPain } from './Pain'

export function init() {
  initPain()
  doInit(registry, cls, ary)
}
