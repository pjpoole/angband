import { doInit } from './init'

import ary from '../../gamedata/dungeon_profile.json'
import { DungeonProfile as cls, DungeonProfileRegistry as registry } from '../world/dungeonProfiles'

export function init() {
  doInit(registry, cls, ary)
}
