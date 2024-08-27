import { doInit } from './init'

import ary from '../../gamedata/world.json'
import { Level as cls, LevelRegistry as registry } from '../world/level'

export function init() {
  doInit(registry, cls, ary)
}
