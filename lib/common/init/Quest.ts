import { doInit } from './init'

import ary from '../../gamedata/quest.json'
import { Quest as cls, QuestRegistry as registry } from '../game/quest'

export function init() {
  doInit(registry, cls, ary)
}
