import { doInit } from './init'

import ary from '../../gamedata/monster_spell.json'
import { MonsterSpell as cls, MonsterSpellRegistry as registry } from '../monsters/spells'

export function init() {
  doInit(registry, cls, ary)
}
