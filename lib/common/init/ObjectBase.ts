import { doInit } from './init'

import ary from '../../gamedata/object.json'
import { ObjectBase as cls, ObjectBaseRegistry as registry } from '../objects/objectBase'

export function init() {
  doInit(registry, cls, ary)
}
