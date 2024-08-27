import { doInit } from './init'

import ary from '../../gamedata/slay.json'
import { Slay as cls, SlayRegistry as registry } from '../objects/slay'

export function init() {
  doInit(registry, cls, ary)
}
