import { doInit } from './init'

import ary from '../../gamedata/pain.json'
import { Pain as cls, PainRegistry as registry} from '../monsters/pain'

export function init() {
  doInit(registry, cls, ary)
}
