import { doInit } from './init'

import ary from '../../gamedata/blow_methods.json'
import { Blow as cls, BlowRegistry as registry } from '../monsters/blows'

export function init() {
  doInit(registry, cls, ary)
}
