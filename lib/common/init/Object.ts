import { doInit } from './init'

import ary from '../../gamedata/object.json'
import { AngbandObject as cls, AngbandObjectRegistry as registry } from '../objects/object'

export function init() {
  doInit(registry, cls, ary)
}
