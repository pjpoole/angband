import { doInit } from './init'

import ary from '../../gamedata/blow_effects.json'
import { BlowEffect as cls, BlowEffectRegistry as registry } from '../monsters/blowEffect'

export function init() {
  doInit(registry, cls, ary)
}
