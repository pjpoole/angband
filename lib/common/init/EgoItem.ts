import { doInit } from './init'

import ary from '../../gamedata/ego_item.json'
import { EgoItem as cls, EgoItemRegistry as registry } from '../objects/egoItem'

export function init() {
  doInit(registry, cls, ary)
}
