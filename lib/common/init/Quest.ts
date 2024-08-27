import { doInit } from './init'

import ary from '../../gamedata/quest.json'
import { Quest as cls, QuestRegistry as registry } from '../game/quest'

import { init as initMonster } from './Monster'

export function init() {
  initMonster()
  doInit(registry, cls, ary)
}
