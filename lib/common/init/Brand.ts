import { doInit } from './init'

import ary from '../../gamedata/brand.json'
import { Brand as cls, BrandRegistry as registry } from '../objects/brand'

export function init() {
  doInit(registry, cls, ary)
}
