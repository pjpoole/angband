import { Loc } from '../../../core/loc'
import { getRandom } from '../../../utilities/iterator'

import { Cave } from '../../cave'
import { Dungeon } from '../../dungeon'
import { Vault, VaultRegistry } from '../../vault'

import { RoomName } from '../index'
import {
  getRandomSymmetryTransform,
  SYMTR
} from './symmetry'

export function buildVaultType(dungeon: Dungeon, chunk: Cave, center: Loc, type: RoomName): boolean {
  const vault = getRandomVault(chunk.depth, type)
  if (vault == null) return false

  return buildVault(dungeon, chunk, center, vault)
}

function buildVault(dungeon: Dungeon, chunk: Cave, center: Loc, vault: Vault): boolean {
  const { height, width } = vault

  let symmetryOp, tHeight, tWidth
  if (!chunk.isInbounds(center)) {
    symmetryOp = getRandomSymmetryTransform(
      height,
      width,
      SYMTR.FLAG_NONE,
    )

    tHeight = symmetryOp.height
    tWidth = symmetryOp.width

    const newCenter = dungeon.findSpace(center.box(tHeight + 2, tWidth + 2))
    if (newCenter == null) return false
    center = newCenter
  } else {
    symmetryOp = getRandomSymmetryTransform(height, width, SYMTR.FLAG_NONE, 0)

    tHeight = symmetryOp.height
    tWidth = symmetryOp.width

    assert(height === symmetryOp.height && width === symmetryOp.width)
  }

  center = center.tr(-1 * Math.trunc(tHeight / 2), -1 * Math.trunc(tWidth / 2))

  return chunk.buildVault(center, vault, symmetryOp)
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
