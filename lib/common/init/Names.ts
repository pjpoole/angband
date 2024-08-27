import { doInit } from './init'

import ary from '../../gamedata/names.json'
import { Name as cls, NamesRegistry as registry } from '../core/names'

export function init() {
  doInit(registry, cls, ary)
}
