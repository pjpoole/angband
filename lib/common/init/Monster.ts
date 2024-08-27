import { doInit } from './init'

import ary from '../../gamedata/monster.json'
import { Monster as cls, MonsterRegistry as registry } from '../monsters/monster'

import { init as initBlow } from './Blow'
import { init as initMonsterBase } from './MonsterBase'

export function init() {
  initBlow()
  initMonsterBase()
  doInit(registry, cls, ary)
}
