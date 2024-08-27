import { doInit } from './init'

import ary from '../../gamedata/terrain.json'
import { Feature as cls, FeatureRegistry as registry } from '../world/features'

export function init() {
  doInit(registry, cls, ary)
}
