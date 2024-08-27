import { doInit } from './init'

import ary from '../../gamedata/room_template.json'
import { RoomTemplate as cls, RoomTemplateRegistry as registry } from '../world/roomTemplate'

export function init() {
  doInit(registry, cls, ary)
}
