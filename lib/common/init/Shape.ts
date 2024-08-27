import { doInit } from './init'

import ary from '../../gamedata/shape.json'
import { Shape as cls, ShapeRegistry as registry } from '../player/shape'

export function init() {
  doInit(registry, cls, ary)
}
