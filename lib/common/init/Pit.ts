import { doInit } from './init'

import ary from '../../gamedata/pit.json'
import { Pit as cls, PitRegistry as registry } from '../world/pit'

export function init() {
  doInit(registry, cls, ary)
}
