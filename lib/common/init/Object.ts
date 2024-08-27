import { doInit } from './init'

import ary from '../../gamedata/object.json'
import { AngbandObject as cls, AngbandObjectRegistry as registry } from '../objects/object'

import { init as initCurse } from './Curse'
import { init as initSlay } from './Slay'

export function init() {
  initSlay()
  initCurse()
  doInit(registry, cls, ary)
}
