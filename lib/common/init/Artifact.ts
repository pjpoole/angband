import { doInit } from './init'

import ary from '../../gamedata/artifact.json'
import { Artifact as cls, ArtifactRegistry as registry } from '../objects/artifact'

import { init as initActivation } from './Activation'
import { init as initBrand } from './Brand'
import { init as initCurse } from './Curse'
import { init as initSlay } from './Slay'

export function init() {
  initActivation()
  initBrand()
  initCurse()
  initSlay()
  doInit(registry, cls, ary)
}
