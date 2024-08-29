import { Loc } from '../../core/loc'
import { Cave } from '../cave'
import { Dungeon } from '../dungeon'

import { buildVaultType } from './helpers/vault'

export function build(
  dungeon: Dungeon,
  chunk: Cave,
  center: Loc,
  rating: number, // not used
): boolean {
  return buildVaultType(dungeon, chunk, center, 'Medium vault (new)')
}
