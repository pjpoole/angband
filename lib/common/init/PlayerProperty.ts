import { doInit } from './init'

import ary from '../../gamedata/player_property.json'
import { PlayerProperty as cls, PlayerPropertyRegistry as registry } from '../player/properties'

export function init() {
  doInit(registry, cls, ary)
}
