import { Loc } from '../../core/loc'
import { randInt1 } from '../../core/rand'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'

import { buildVaultType, getRandomVault, VaultGenerator } from './helpers/vault'

export function build(
  dungeon: Dungeon,
  chunk: Cave,
  center: Loc,
  rating: number, // not used
): boolean {
  return buildVaultType(dungeon, chunk, center, 'Greater vault')
}

export function buildRoom(): Cave | null {
  const depth = randInt1(100)
  const vault = getRandomVault(depth, 'Greater vault')
  if (vault == null) return null
  const generator = new VaultGenerator({ depth, vault })
  return generator.build()
}
