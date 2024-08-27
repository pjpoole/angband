import { doInit } from './init'

import ary from '../../gamedata/pit.json'
import { Pit as cls, PitRegistry as registry } from '../world/pit'

import { init as initMonster } from './Monster'

export function init() {
  initMonster()
  doInit(registry, cls, ary)
}
