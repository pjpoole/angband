import { Coord } from '../../../core/coordinate'
import { getRandom } from '../../../utilities/iterator'

import { Cave } from '../../cave'
import { Dungeon } from '../../dungeon'
import { VaultRegistry } from '../../vault'

export function buildVaultType(dungeon: Dungeon, chunk: Cave, center: Coord, type: string): boolean {
  const vault = getRandomVault(chunk.depth, type)
  if (vault == null) return false
  return true
}

function getRandomVault(depth: number, type: string) {
  return getRandom(VaultRegistry, (vault) => {
    return(
      vault.type === type &&
      vault.minDepth <= depth &&
      vault.maxDepth >= depth
    )
  })
}
