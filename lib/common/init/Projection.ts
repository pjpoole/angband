import { doInit } from './init'

import ary from '../../gamedata/projection.json'
import { Projection as cls, ProjectionRegistry as registry } from '../spells/Projection'

export function init() {
  doInit(registry, cls, ary)
}
