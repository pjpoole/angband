import { doInit } from './init'

import ary from '../../gamedata/vault.json'
import { Vault as cls, VaultRegistry as registry } from '../world/vault'

export function init() {
  doInit(registry, cls, ary)
}
