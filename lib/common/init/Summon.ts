import { doInit } from './init'

import ary from '../../gamedata/summon.json'
import { Summon as cls, SummonRegistry as registry } from '../spells/summons'

import { init as initMonsterBase } from './MonsterBase'

export function init() {
  initMonsterBase()
  doInit(registry, cls, ary)
}
