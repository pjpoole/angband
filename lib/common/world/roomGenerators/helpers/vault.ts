import { Loc } from '../../../core/loc'
import { oneIn, randInt0 } from '../../../core/rand'
import { getRandom } from '../../../utilities/iterator'
import { isAlpha } from '../../../utilities/string'

import { Cave } from '../../cave'
import { Dungeon } from '../../dungeon'
import { FEAT } from '../../features'
import { ORIGIN } from '../../../objects/origin'
import { TV } from '../../../objects/tval'
import { SQUARE } from '../../square'
import { ROOMF } from '../../roomTemplate'
import { Vault, VaultRegistry } from '../../vault'

import { RoomName } from '../index'
import { placeObject } from './object'
import { getVaultMonsters, pickAndPlaceMonster } from './monster'
import {
  getRandomSymmetryTransform, symmetryTransform, SymmetryTransform,
  SYMTR
} from './symmetry'

export function buildVaultType(
  dungeon: Dungeon,
  chunk: Cave,
  center: Loc,
  type: RoomName
): boolean {
  const vault = getRandomVault(chunk.depth, type)
  if (vault == null) return false

  return buildVault(dungeon, chunk, center, vault)
}

function buildVault(
  dungeon: Dungeon,
  chunk: Cave,
  center: Loc,
  vault: Vault
): boolean {
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

    assert(height === tHeight && width === tWidth)
  }

  return doBuildVault(chunk, center, vault, symmetryOp)
}

function doBuildVault(
  chunk: Cave,
  center: Loc,
  vault: Vault,
  transform?: SymmetryTransform,
): boolean {
  const { height, width } = vault
  const {
    rotate = 0,
    reflect = false,
    height: tHeight,
    width: tWidth
  } = transform ?? {}

  // porting kind of squirrelly logic
  // TODO: trace variables and see if the ?? are required
  const b = center.box(tHeight ?? height, tWidth ?? width)
  chunk.turnOnBox(b, SQUARE.MON_RESTRICT)

  vault.room.forEach((char, pt) => {
    if (char === ' ') return

    const p = symmetryTransform(pt, b, rotate, reflect)

    assert(b.contains(p))

    const tile = chunk.tiles.get(p)

    chunk.setFeature(tile, FEAT.FLOOR)

    let icky = true

    switch (char) {
      case '%':
        // outer wall that the algorithm is allowed to connect to the tunnels
        chunk.setMarkedGranite(p, SQUARE.WALL_OUTER)
        if (vault.flags.has(ROOMF.FEW_ENTRANCES)) {
          // TODO: append_entrance
        }
        icky = false
        break
      case '#': // inner or non-tunnelable outside granite wall
        chunk.setMarkedGranite(p, SQUARE.WALL_SOLID)
        break
      case '@': // permanent wall
        chunk.setFeature(tile, FEAT.PERM)
        break
      case '*': // gold seam
        chunk.setFeature(tile, oneIn(2) ? FEAT.MAGMA_K : FEAT.QUARTZ_K)
        break
      case ':': // rubble
        chunk.setFeature(tile, oneIn(2) ? FEAT.PASS_RUBBLE : FEAT.RUBBLE)
        break
      case '+': // secret door
        chunk.placeSecretDoor(p)
        break
      case '^': // trap
        if (oneIn(4)) chunk.placeTrap(p, -1, chunk.depth)
        break
      case '&': // treasure or trap
        if (randInt0(4) < 3) {
          placeObject(chunk, p, chunk.depth, false, false, ORIGIN.VAULT, 0)
        } else if (oneIn(4)) {
          chunk.placeTrap(p, -1, chunk.depth)
        }
        break
      case '<': // up stairs
                // if dungeon->persist break
        chunk.setFeature(tile, FEAT.LESS)
        break
      case '>': // down stairs
                // if dungeon->persist break
                // if quest or we're already at max depth, upstairs instead
        chunk.setFeature(tile, FEAT.MORE)
        break
      case '`': // lavel
        chunk.setFeature(tile, FEAT.LAVA)
        break
      case '/': // water
      case ';': // tree
    }

    tile.turnOn(SQUARE.ROOM)
    if (icky) tile.turnOn(SQUARE.VAULT)
  })

  const foundRaces = new Set<string>()
  vault.room.forEach((char, pt) => {
    if (char === ' ') return

    const p = symmetryTransform(pt, b, rotate, reflect)
    assert(b.contains(p))

    const tile = chunk.tiles.get(p)

    if (isAlpha(char) && char !== 'x' && char !== 'X') {
      foundRaces.add(char)
    } else {
      switch (char) {
        case '1': // monster, (maybe good) object, or trap
          if (oneIn(2)) {
            pickAndPlaceMonster(
              chunk,
              p,
              chunk.depth,
              true,
              true,
              ORIGIN.DROP_VAULT
            )
          } else if (oneIn(2)) {
            placeObject(chunk, p, chunk.depth, oneIn(8), false, ORIGIN.VAULT, 0)
          } else if (oneIn(4)) {
            chunk.placeTrap(p, -1, chunk.depth)
          }
          break
        case '2': // slightly OOD monster
          pickAndPlaceMonster(
            chunk,
            p,
            chunk.depth + 5,
            true,
            true,
            ORIGIN.DROP_VAULT
          )
          break
        case '3': // slightly OOD object
          placeObject(chunk, p, chunk.depth + 3, false, false, ORIGIN.VAULT, 0)
          break
        case '4': // monster and/or object
          if (oneIn(2)) {
            pickAndPlaceMonster(
              chunk,
              p,
              chunk.depth + 3,
              true,
              true,
              ORIGIN.DROP_VAULT
            )
          }
          if (oneIn(2)) {
            placeObject(chunk, p, chunk.depth + 7, false, false, ORIGIN.VAULT, 0)
          }
          break
        case '5': // OOD object
          placeObject(chunk, p, chunk.depth + 7, false, false, ORIGIN.VAULT, 0)
          break
        case '6': // OOD monster
          pickAndPlaceMonster(
            chunk,
            p,
            chunk.depth + 11,
            true,
            true,
            ORIGIN.DROP_VAULT
          )
          break
        case '7': // very OOD object
          placeObject(chunk, p, chunk.depth + 15, false, false, ORIGIN.VAULT, 0)
          break
        case '8': // nasty monster, and treasure
          pickAndPlaceMonster(
            chunk,
            p,
            chunk.depth + 40,
            true,
            true,
            ORIGIN.DROP_VAULT
          )
          placeObject(chunk, p, chunk.depth + 20, true, true, ORIGIN.VAULT, 0)
          break
        case '9': // mean monster, and treasure
          pickAndPlaceMonster(
            chunk,
            p,
            chunk.depth + 9,
            true,
            true,
            ORIGIN.DROP_VAULT
          )
          placeObject(chunk, p, chunk.depth + 7, true, false, ORIGIN.VAULT, 0)
          break
        case '0': // very OOD monster
          pickAndPlaceMonster(
            chunk,
            p,
            chunk.depth + 20,
            true,
            true,
            ORIGIN.DROP_VAULT
          )
          break
        case '~': // treasure chest
          placeObject(
            chunk,
            p,
            chunk.depth + 5,
            false,
            false,
            ORIGIN.VAULT,
            TV.CHEST
          )
          break
        case '$': // treasure
          chunk.placeGold(p, chunk.depth, ORIGIN.VAULT)
          break
        case ']': { // armor
          const roll = randInt0(oneIn(3) ? 9 : 8)
          const tval = [
            TV.BOOTS, TV.GLOVES, TV.HELM, TV.CROWN, TV.SHIELD,
            TV.CLOAK, TV.SOFT_ARMOR, TV.HARD_ARMOR, TV.DRAG_ARMOR
          ][roll]
          placeObject(chunk, p, chunk.depth + 3, true, false, ORIGIN.VAULT, tval)
          break
        }
        case '|': { // weapon
          const roll = randInt0(4)
          const tval = [TV.BOOTS, TV.GLOVES, TV.HELM, TV.CROWN][roll]
          placeObject(chunk, p, chunk.depth + 3, true, false, ORIGIN.VAULT, tval)
          break
        }
        case '=': // ring
          placeObject(
            chunk,
            p,
            chunk.depth + 3,
            oneIn(4),
            false,
            ORIGIN.VAULT,
            TV.RING
          )
          break
        case '"': // amulet
          placeObject(
            chunk,
            p,
            chunk.depth + 3,
            oneIn(4),
            false,
            ORIGIN.VAULT,
            TV.AMULET
          )
          break
        case '!': // potion
          placeObject(
            chunk,
            p,
            chunk.depth + 3,
            oneIn(4),
            false,
            ORIGIN.VAULT,
            TV.POTION
          )
          break
        case '?': // scroll
          placeObject(
            chunk,
            p,
            chunk.depth + 3,
            oneIn(4),
            false,
            ORIGIN.VAULT,
            TV.SCROLL
          )
          break
        case '_': // staff
          placeObject(
            chunk,
            p,
            chunk.depth + 3,
            oneIn(4),
            false,
            ORIGIN.VAULT,
            TV.STAFF
          )
          break
        case '-': { // wand or rod
          const tval = oneIn(2) ? TV.WAND : TV.ROD
          placeObject(
            chunk,
            p,
            chunk.depth + 3,
            oneIn(4),
            false,
            ORIGIN.VAULT,
            tval
          )
          break
        }
        case ',': // Food or mushroom
          placeObject(
            chunk,
            p,
            chunk.depth + 3,
            oneIn(4),
            false,
            ORIGIN.VAULT,
            TV.FOOD
          )
          break
        case '#':
          // Check consistency with first pass
          assert(tile.isRoom() && tile.isVault() && tile.isGranite() && tile.has(
            SQUARE.WALL_SOLID))

          // Convert to SQUARE.WALL_INNER if it does not touch the outside of
          // the vault
          if ((chunk.countNeighbors(pt, false, (tile) => tile.isRoom()) === 8)) {
            tile.turnOff(SQUARE.WALL_SOLID)
            tile.turnOn(SQUARE.WALL_INNER)
          }
          break
        case '@': // permanent wall
          // Check consistency with first pass
          assert(tile.isRoom() && tile.isVault() && tile.isPermanent())

          // Convert to SQUARE.WALL_INNER if it does not touch the outside of
          // the vault
          if ((chunk.countNeighbors(pt, false, (tile) => tile.isRoom()) === 8)) {
            tile.turnOn(SQUARE.WALL_INNER)
          }
      }
    }
  })

  getVaultMonsters(chunk, b, vault, foundRaces)
  return true
}


function getRandomVault(depth: number, type: RoomName) {
  return getRandom(VaultRegistry, (vault) => {
    return (
      vault.type === type &&
      vault.minDepth <= depth &&
      vault.maxDepth >= depth
    )
  })
}
