import { Loc } from '../../../core/loc'
import { getRandom } from '../../../utilities/iterator'

import { Cave } from '../../cave'
import { Dungeon } from '../../dungeon'
import { VaultRegistry } from '../../vault'
import { RoomName } from '../index'

export function buildVaultType(dungeon: Dungeon, chunk: Cave, center: Loc, type: RoomName): boolean {
  const vault = getRandomVault(chunk.depth, type)
  if (vault == null) return false
  return true
}

function getRandomVault(depth: number, type: RoomName) {
  return getRandom(VaultRegistry, (vault) => {
    return(
      vault.type === type &&
      vault.minDepth <= depth &&
      vault.maxDepth >= depth
    )
  })
}
