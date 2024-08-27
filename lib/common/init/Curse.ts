import { doInit } from './init'

import ary from '../../gamedata/curse.json'
import { Curse as cls, CurseRegistry as registry } from '../objects/curse'

export function init() {
  doInit(registry, cls, ary)
}
