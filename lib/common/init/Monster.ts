import { doInit } from './init'

import ary from '../../gamedata/monster.json'
import { Monster as cls, MonsterRegistry as registry } from '../monsters/monster'

export function init() {
  doInit(registry, cls, ary)
}
