import { doInit } from './init'

import ary from '../../gamedata/artifact.json'
import { Artifact as cls, ArtifactRegistry as registry } from '../objects/artifact'

export function init() {
  doInit(registry, cls, ary)
}
