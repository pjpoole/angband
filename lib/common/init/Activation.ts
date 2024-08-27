import { doInit } from './init'

import ary from '../../gamedata/activation.json'
import { Activation as cls, ActivationRegistry as registry } from '../objects/activation'

export function init() {
  doInit(registry, cls, ary)
}
