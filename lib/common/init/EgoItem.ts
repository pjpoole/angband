import { doInit } from './init'

import ary from '../../gamedata/ego_item.json'
import { EgoItem as cls, EgoItemRegistry as registry } from '../objects/egoItem'

import { init as initBrand } from './Brand'
import { init as initSlay } from './Slay'

export function init() {
  initBrand()
  initSlay()
  doInit(registry, cls, ary)
}
