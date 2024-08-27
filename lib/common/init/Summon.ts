import { doInit } from './init'

import ary from '../../gamedata/summon.json'
import { Summon as cls, SummonRegistry as registry } from '../spells/summons'

export function init() {
  doInit(registry, cls, ary)
}
