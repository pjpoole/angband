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
import { placeSecretDoor } from './door'
import { placeObject } from './object'
import { getVaultMonsters, pickAndPlaceMonster } from './monster'
import {
  getRandomSymmetryTransform, symmetryTransform,
  SYMTR
} from './symmetry'
import { placeTrap } from './trap'
import { placeGold } from './treasure'

import { RoomGeneratorBase } from '../RoomGenerator'

export function buildVaultType(
  dungeon: Dungeon,
  cave: Cave,
  center: Loc,
  type: RoomName
): boolean {
  const vault = getRandomVault(cave.depth, type)
  if (vault == null) return false

  const generator = new VaultGenerator({ vault, depth: cave.depth })
  return generator.draw(dungeon, cave, center)
}

export interface VaultGeneratingParams {
  vault: Vault
  depth: number
  rotate?: number
  reflect?: boolean
}

export class VaultGenerator extends RoomGeneratorBase {
  private rotate: number
  private reflect: boolean
  private readonly vault: Vault

  constructor(params: VaultGeneratingParams) {
    const { vault, depth, rotate, reflect } = params
    const { height, width } = vault

    super({ height, width, depth})

    this.vault = vault
    this.reflect = reflect ?? false
    this.rotate = rotate ? rotate % 4 : 0
  }

  protected validateCenter(
    dungeon: Dungeon,
    cave: Cave,
    center: Loc
  ): Loc | null {
    const rotationAllowed = cave.isInbounds(center)
    const allowRotate = rotationAllowed ? undefined : 0

    const symmetryOp = getRandomSymmetryTransform(
      this.height,
      this.width,
      SYMTR.FLAG_NONE,
      allowRotate,
    )

    const { rotate, reflect, height, width } = symmetryOp

    if (!rotationAllowed) {
      assert(this.height === height && this.width === width)
    }
    this.height = height
    this.width = width
    this.rotate = rotate
    this.reflect = reflect

    return super.validateCenter(dungeon, cave, center)
  }

  build(): Cave {
    const { rotate, reflect } = this
    const chunk = this.getNewCave()

    // porting kind of squirrelly logic
    // TODO: trace variables and see if the ?? are required
    //       (Used to refer to use of transform height and width)
    const b = chunk.box

    chunk.turnOnBox(b, SQUARE.MON_RESTRICT)

    this.vault.room.forEach((char, pt) => {
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
          if (this.vault.flags.has(ROOMF.FEW_ENTRANCES)) {
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
          placeSecretDoor(chunk, p)
          break
        case '^': // trap
          if (oneIn(4)) placeTrap(chunk, p, -1, chunk.depth)
          break
        case '&': // treasure or trap
          if (randInt0(4) < 3) {
            placeObject(chunk, p, chunk.depth, false, false, ORIGIN.VAULT, 0)
          } else if (oneIn(4)) {
            placeTrap(chunk, p, -1, chunk.depth)
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
        case '`': // lava
          chunk.setFeature(tile, FEAT.LAVA)
          break
        case '/': // water
        case ';': // tree
      }

      tile.turnOn(SQUARE.ROOM)
      if (icky) tile.turnOn(SQUARE.VAULT)
    })

    const foundRaces = new Set<string>()
    this.vault.room.forEach((char, pt) => {
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
              placeObject(
                chunk,
                p,
                chunk.depth,
                oneIn(8),
                false,
                ORIGIN.VAULT,
                0
              )
            } else if (oneIn(4)) {
              placeTrap(chunk, p, -1, chunk.depth)
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
            placeObject(
              chunk,
              p,
              chunk.depth + 3,
              false,
              false,
              ORIGIN.VAULT,
              0
            )
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
              placeObject(
                chunk,
                p,
                chunk.depth + 7,
                false,
                false,
                ORIGIN.VAULT,
                0
              )
            }
            break
          case '5': // OOD object
            placeObject(
              chunk,
              p,
              chunk.depth + 7,
              false,
              false,
              ORIGIN.VAULT,
              0
            )
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
            placeObject(
              chunk,
              p,
              chunk.depth + 15,
              false,
              false,
              ORIGIN.VAULT,
              0
            )
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
            placeGold(chunk, p, chunk.depth, ORIGIN.VAULT)
            break
          case ']': { // armor
            const roll = randInt0(oneIn(3) ? 9 : 8)
            const tval = [
              TV.BOOTS, TV.GLOVES, TV.HELM, TV.CROWN, TV.SHIELD,
              TV.CLOAK, TV.SOFT_ARMOR, TV.HARD_ARMOR, TV.DRAG_ARMOR
            ][roll]
            placeObject(
              chunk,
              p,
              chunk.depth + 3,
              true,
              false,
              ORIGIN.VAULT,
              tval
            )
            break
          }
          case '|': { // weapon
            const roll = randInt0(4)
            const tval = [TV.BOOTS, TV.GLOVES, TV.HELM, TV.CROWN][roll]
            placeObject(
              chunk,
              p,
              chunk.depth + 3,
              true,
              false,
              ORIGIN.VAULT,
              tval
            )
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
            if ((chunk.countNeighbors(
              pt,
              false,
              (tile) => tile.isRoom()
            ) === 8)) {
              tile.turnOff(SQUARE.WALL_SOLID)
              tile.turnOn(SQUARE.WALL_INNER)
            }
            break
          case '@': // permanent wall
                    // Check consistency with first pass
            assert(tile.isRoom() && tile.isVault() && tile.isPermanent())

            // Convert to SQUARE.WALL_INNER if it does not touch the outside of
            // the vault
            if ((chunk.countNeighbors(
              pt,
              false,
              (tile) => tile.isRoom()
            ) === 8)) {
              tile.turnOn(SQUARE.WALL_INNER)
            }
        }
      }
    })

    getVaultMonsters(chunk, b, this.vault, foundRaces)
    return chunk
  }
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
