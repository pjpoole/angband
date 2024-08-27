import { doInit } from './init'

import ary from '../../gamedata/curse.json'
import { Curse as cls, CurseRegistry as registry } from '../objects/curse'

import { init as initObjectBase } from './ObjectBase'

export function init() {
  initObjectBase()
  doInit(registry, cls, ary)
}
