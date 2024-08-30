import { Box, loc, Loc } from '../core/loc'
import { oneIn, randInt0, randInt1 } from '../core/rand'

import { getNeighbors } from '../utilities/directions'
import { asInteger } from '../utilities/parsing/primitives'
import { Rectangle } from '../utilities/rectangle'
import { isAlpha } from '../utilities/string'

import {
  SymmetryTransform,
  symmetryTransform
} from './roomGenerators/helpers/symmetry'

import { FEAT, Feature, FeatureRegistry } from './features'
import { ORIGIN } from '../objects/origin'
import { TV } from '../objects/tval'
import { ROOMF, RoomTemplate } from './roomTemplate'
import { SQUARE } from './square'
import { Tile } from './tile'
import { Vault } from './vault'

interface CaveParams {
  height: number
  width: number
  depth: number
  fill?: Feature | FEAT
  border?: Feature | FEAT
  flag?: SQUARE
}

type FeatureCount = Record<FEAT, number>

// This is going to have significant overlap with GameMap until they're aligned
// TODO: a lot of generation methods that are only used during a limited
//       timeframe; for the sake of cleanliness, consider either making a
//       separate CaveGenerator class, or make generic functions that operate
//       over Cave objects
export class Cave {
  readonly height: number
  readonly width: number
  readonly depth: number

  readonly tiles: Rectangle<Tile>

  // TODO: not space efficient; bitflag
  private readonly featureCount: FeatureCount

  constructor(params: CaveParams) {
    this.width = params.width
    this.height = params.height
    this.depth = params.depth

    this.featureCount = this.initFeatureCount()

    const fill: Feature | undefined = params.fill !== null && typeof params.fill === 'number'
      ? FeatureRegistry.get(params.fill)
      : params.fill

    this.tiles = new Rectangle(this.height, this.width, (pt: Loc): Tile => {
      const tile = new Tile(pt, fill, params.flag)
      this.featureCount[tile.feature.code] += 1
      return tile
    })

    if (params.border) {
      const border = typeof params.border === 'number'
        ? FeatureRegistry.get(params.border)
        : params.border

      this.tiles.forEachBorder((tile) => {
        this.setFeature(tile, border)
      })
    }
  }

  private initFeatureCount(): FeatureCount {
    const result: Partial<FeatureCount> = {}
    for (const code of Object.values(FEAT)) {
      if (typeof code === 'number') {
        result[code] = 0
      }
    }

    return result as FeatureCount
  }

  get box() {
    return this.tiles.box
  }

  get(p: Loc): Tile {
    return this.tiles.get(p)
  }

  // previously known as generateMark
  turnOnBox(
    b: Box,
    flag: SQUARE,
  ) {
    this.tiles.forEach(b, (tile) => { tile.turnOn(flag) })
  }

  turnOn(p: Loc, flag: SQUARE) {
    this.tiles.get(p).turnOn(flag)
  }

  turnOff(p: Loc, flag: SQUARE) {
    this.tiles.get(p).turnOff(flag)
  }

  // generation
  setBorderingWalls(b: Box) {
    const clipped = this.tiles.intersect(b)
    const topLeft = loc(clipped.left, clipped.top)

    const refToOffset = (p: Loc): Loc => p.diff(topLeft)
    const offsetToRef = (p: Loc): Loc => p.sum(topLeft)

    const walls = new Rectangle(b.height, b.width, true)

    this.tiles.forEach(clipped, (tile, pt) => {
      if (!tile.isFloor()) {
        assert(!tile.isRoom())
        return
      }

      assert(tile.isRoom())

      const neighbors = this.tiles.intersect(pt.box(3))

      if (neighbors.height !== 3 || neighbors.width !== 3) {
        // we hit the edge of the map
        walls.set(refToOffset(pt), true)
      } else {
        let floorCount = 0
        this.tiles.forEach(neighbors, (tile) => {
          const isFloor = tile.isFloor()
          assert(isFloor === tile.isRoom())
          if (isFloor) floorCount++
        })

        if (floorCount != 9) {
          walls.set(refToOffset(pt), true)
        }
      }
    })

    walls.forEach((val, pt) => {
      if (val) {
        const offset = offsetToRef(pt)
        const tile = this.tiles.get(offset)
        assert(tile.isFloor() && tile.isRoom())
        this.setMarkedGranite(offset, SQUARE.WALL_OUTER)
      }
    })
  }

  buildVault(
    center: Loc,
    vault: Vault,
    transform?: SymmetryTransform,
  ): boolean {
    const { height, width } = vault
    const { rotate = 0, reflect = false, height: tHeight, width: tWidth } = transform ?? {}

    // porting kind of squirrelly logic
    // TODO: trace variables and see if the ?? are required
    const b = center.box(tHeight ?? height, tWidth ?? width)
    this.turnOnBox(b, SQUARE.MON_RESTRICT)

    vault.room.forEach((char, pt) => {
      if (char === ' ') return

      const p = symmetryTransform(pt, b, rotate, reflect)

      assert(b.contains(p))

      const tile = this.tiles.get(p)

      this.setFeature(tile, FEAT.FLOOR)

      let icky = true

      switch (char) {
        case '%':
          // outer wall that the algorithm is allowed to connect to the tunnels
          this.setMarkedGranite(p, SQUARE.WALL_OUTER)
          if (vault.flags.has(ROOMF.FEW_ENTRANCES)) {
            // TODO: append_entrance
          }
          icky = false
          break
        case '#': // inner or non-tunnelable outside granite wall
          this.setMarkedGranite(p, SQUARE.WALL_SOLID)
          break
        case '@': // permanent wall
          this.setFeature(tile, FEAT.PERM)
          break
        case '*': // gold seam
          this.setFeature(tile, oneIn(2) ? FEAT.MAGMA_K : FEAT.QUARTZ_K)
          break
        case ':': // rubble
          this.setFeature(tile, oneIn(2) ? FEAT.PASS_RUBBLE : FEAT.RUBBLE)
          break
        case '+': // secret door
          this.placeSecretDoor(p)
          break
        case '^': // trap
          if (oneIn(4)) this.placeTrap(p, -1, this.depth)
          break
        case '&': // treasure or trap
          if (randInt0(4) < 3) {
            this.placeObject(p, this.depth, false, false, ORIGIN.VAULT, 0)
          } else if (oneIn(4)) {
            this.placeTrap(p, -1, this.depth)
          }
          break
        case '<': // up stairs
          // if dungeon->persist break
          this.setFeature(tile, FEAT.LESS)
          break
        case '>': // down stairs
          // if dungeon->persist break
          // if quest or we're already at max depth, upstairs instead
          this.setFeature(tile, FEAT.MORE)
          break
        case '`': // lavel
          this.setFeature(tile, FEAT.LAVA)
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

      const tile = this.tiles.get(p)

      if (isAlpha(char) && char !== 'x' && char !== 'X') {
        foundRaces.add(char)
      } else {
        switch (char) {
          case '1': // monster, (maybe good) object, or trap
            if (oneIn(2)) {
              this.pickAndPlaceMonster(p, this.depth, true, true, ORIGIN.DROP_VAULT)
            } else if (oneIn(2)) {
              this.placeObject(p, this.depth, oneIn(8), false, ORIGIN.VAULT, 0)
            } else if (oneIn(4)) {
              this.placeTrap(p, -1, this.depth)
            }
            break
          case '2': // slightly OOD monster
            this.pickAndPlaceMonster(p, this.depth + 5, true, true, ORIGIN.DROP_VAULT)
            break
          case '3': // slightly OOD object
            this.placeObject(p, this.depth + 3, false, false, ORIGIN.VAULT, 0)
            break
          case '4': // monster and/or object
            if (oneIn(2)) {
              this.pickAndPlaceMonster(p, this.depth + 3, true, true, ORIGIN.DROP_VAULT)
            }
            if (oneIn(2)) {
              this.placeObject(p, this.depth + 7, false, false, ORIGIN.VAULT, 0)
            }
            break
          case '5': // OOD object
            this.placeObject(p, this.depth + 7, false, false, ORIGIN.VAULT, 0)
            break
          case '6': // OOD monster
            this.pickAndPlaceMonster(p, this.depth + 11, true, true, ORIGIN.DROP_VAULT)
            break
          case '7': // very OOD object
            this.placeObject(p, this.depth + 15, false, false, ORIGIN.VAULT, 0)
            break
          case '8': // nasty monster, and treasure
            this.pickAndPlaceMonster(p, this.depth + 40, true, true, ORIGIN.DROP_VAULT)
            this.placeObject(p, this.depth + 20, true, true, ORIGIN.VAULT, 0)
            break
          case '9': // mean monster, and treasure
            this.pickAndPlaceMonster(p, this.depth + 9, true, true, ORIGIN.DROP_VAULT)
            this.placeObject(p, this.depth + 7, true, false, ORIGIN.VAULT, 0)
            break
          case '0': // very OOD monster
            this.pickAndPlaceMonster(p, this.depth + 20, true, true, ORIGIN.DROP_VAULT)
            break
          case '~': // treasure chest
            this.placeObject(p, this.depth + 5, false, false, ORIGIN.VAULT, TV.CHEST)
            break
          case '$': // treasure
            this.placeGold(p, this.depth, ORIGIN.VAULT)
            break
          case ']': { // armor
            const roll = randInt0(oneIn(3) ? 9 : 8)
            const tval = [
              TV.BOOTS, TV.GLOVES, TV.HELM, TV.CROWN, TV.SHIELD,
              TV.CLOAK, TV.SOFT_ARMOR, TV.HARD_ARMOR, TV.DRAG_ARMOR
            ][roll]
            this.placeObject(p, this.depth + 3, true, false, ORIGIN.VAULT, tval)
            break
          }
          case '|': { // weapon
            const roll = randInt0(4)
            const tval = [TV.BOOTS, TV.GLOVES, TV.HELM, TV.CROWN][roll]
            this.placeObject(p, this.depth + 3, true, false, ORIGIN.VAULT, tval)
            break
          }
          case '=': // ring
            this.placeObject(p, this.depth + 3, oneIn(4), false, ORIGIN.VAULT, TV.RING)
            break
          case '"': // amulet
            this.placeObject(p, this.depth + 3, oneIn(4), false, ORIGIN.VAULT,  TV.AMULET)
            break
          case '!': // potion
            this.placeObject(p, this.depth + 3, oneIn(4), false, ORIGIN.VAULT, TV.POTION)
            break
          case '?': // scroll
            this.placeObject(p, this.depth + 3, oneIn(4), false, ORIGIN.VAULT, TV.SCROLL)
            break
          case '_': // staff
            this.placeObject(p, this.depth + 3, oneIn(4), false, ORIGIN.VAULT, TV.STAFF)
            break
          case '-': { // wand or rod
            const tval = oneIn(2) ? TV.WAND : TV.ROD
            this.placeObject(p, this.depth + 3, oneIn(4), false, ORIGIN.VAULT, tval)
            break
          }
          case ',': // Food or mushroom
            this.placeObject(p, this.depth + 3, oneIn(4), false, ORIGIN.VAULT, TV.FOOD)
            break
          case '#':
            // Check consistency with first pass
            assert(tile.isRoom() && tile.isVault() && tile.isGranite() && tile.has(SQUARE.WALL_SOLID))

            // Convert to SQUARE.WALL_INNER if it does not touch the outside of
            // the vault
            if ((this.countNeighbors(pt, false, (tile) => tile.isRoom()) === 8)) {
              tile.turnOff(SQUARE.WALL_SOLID)
              tile.turnOn(SQUARE.WALL_INNER)
            }
            break
          case '@': // permanent wall
            // Check consistency with first pass
            assert(tile.isRoom() && tile.isVault() && tile.isPermanent())

            // Convert to SQUARE.WALL_INNER if it does not touch the outside of
            // the vault
            if ((this.countNeighbors(pt, false, (tile) => tile.isRoom()) === 8)) {
              tile.turnOn(SQUARE.WALL_INNER)
            }
        }
      }
    })

    this.getVaultMonsters(b, vault, foundRaces)
    return true
  }

  buildRoomTemplate(
    center: Loc,
    template: RoomTemplate,
    transform?: SymmetryTransform,
  ): boolean {
    const { height, width, doors } = template
    const { rotate = 0, reflect = false } = transform ?? {}

    const light = this.depth <= randInt1(25)
    // Which random doors will we generate
    const randomDoor = randInt1(doors)
    // Do we generate optional walls
    const randomWalls = oneIn(2)

    const b = center.box(height, width)

    template.room.forEach((char, ptPre) => {
      if (char === ' ') return

      const p = symmetryTransform(ptPre, b, rotate, reflect)
      const tile = this.tiles.get(p)
      this.setFeature(tile, FEAT.FLOOR)
      assert(tile.isEmpty())

      switch (char) {
        case '%':
          this.setMarkedGranite(p, SQUARE.WALL_OUTER)
          if (template.flags.has(ROOMF.FEW_ENTRANCES)) {
            // TODO: append entrance
          }
          break
        case '#':
          this.setMarkedGranite(p, SQUARE.WALL_SOLID)
          break
        case '+':
          this.placeClosedDoor(p)
          break
        case '^':
          if (oneIn(4)) {
            this.placeTrap(p, -1, this.depth)
          }
          break
        case 'x':
          if (randomWalls) this.setMarkedGranite(p, SQUARE.WALL_SOLID)
          break
        case '(':
          if (randomWalls) this.placeSecretDoor(p)
          break
        case ')':
          if (!randomWalls) this.placeSecretDoor(p)
          else this.setMarkedGranite(p, SQUARE.WALL_SOLID)
          break
        case '8':
          // TODO: or dungeon persist
          oneIn(5)
            // TODO: identify if this is a quest level
            ? this.placeRandomStairs(p, false)
            : this.placeObject(p, this.depth, false, false, ORIGIN.SPECIAL, 0)
          break
        case '9':

          // handled in second pass
          break
        case '[':
          this.placeObject(p, this.depth, false, false, ORIGIN.SPECIAL, 0)
          break
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
          const doorNum = asInteger(char)
          doorNum === randomDoor
            ? this.placeSecretDoor(p)
            : this.setMarkedGranite(p, SQUARE.WALL_SOLID)
          break
      }

      tile.turnOn(SQUARE.ROOM)
      if (light) tile.turnOn(SQUARE.GLOW)
    })

    // Second pass to place items after first pass has completed
    template.room.forEach((char, ptPre) => {
      const pt = symmetryTransform(ptPre, b, rotate, reflect)
      const tile = this.tiles.get(pt)

      switch (char) {
        case '#':
          assert(tile.isRoom() && tile.isGranite() && tile.has(SQUARE.WALL_SOLID))

          if ((this.countNeighbors(pt, false, (tile) => tile.isRoom()) === 8)) {
            tile.turnOff(SQUARE.WALL_SOLID)
            tile.turnOn(SQUARE.WALL_INNER)
          }
          break
        case '8':
          assert(tile.isRoom() && (tile.isFloor() || tile.isStair()))
          this.placeNVaultMonsters(pt, this.depth + 2, randInt0(2) + 3)
          break
        case '9':
          const offset1 = loc(2, -2)
          const offset2 = loc(3, -3)

          assert(tile.isRoom() && tile.isFloor())

          this.placeNVaultMonsters(pt.diff(offset2), this.depth + randInt0(2), randInt1(2))
          this.placeNVaultMonsters(pt.diff(offset2), this.depth + randInt0(2), randInt1(2))

          if (oneIn(2)) {
            this.placeNVaultObjects(pt.diff(offset1), this.depth, randInt1(2))
          }
          if (oneIn(2)) {
            this.placeNVaultObjects(pt.diff(offset1), this.depth, randInt1(2))
          }
          break
      }
    })

    return true
  }



  // TODO: Maybe return coord of hole
  generateHole(b: Box, feature: Feature | FEAT) {
    const center = b.center()

    let { x, y } = center
    // pick a random wall center
    switch (randInt0(4)) {
      case 0: y = b.top; break
      case 1: x = b.left; break
      case 2: y = b.bottom; break
      case 3: x = b.right; break
    }
    const point = loc(x, y)
    assert(point.isOnEdge(b))

    this.setFeature(this.tiles.get(point), feature)
  }

  placeClosedDoor(pt: Loc) {
    const tile = this.tiles.get(pt)
    this.setFeature(tile, FEAT.CLOSED)
    // TODO: traps: randomly set door lock strength
  }

  placeSecretDoor(pt: Loc) {
    const tile = this.tiles.get(pt)
    this.setFeature(tile, FEAT.SECRET)
  }

  hollowRoom(pt: Loc) {
    for (const p of pt.box(3)) {
      const tile = this.tiles.get(p)
      if (tile.is(FEAT.MAGMA)) {
        this.setFeature(tile, FEAT.FLOOR)
        this.hollowRoom(p)
      } else if (tile.is(FEAT.OPEN)) {
        this.setFeature(tile, FEAT.BROKEN)
        this.hollowRoom(p)
      }
    }
  }

  placeRandomStairs(pt: Loc, isQuest: boolean) {}

  pickAndPlaceMonster(pt: Loc, depth: number, sleep: boolean, groupOk: boolean, origin: ORIGIN) {}
  getVaultMonsters(b: Box, vault: Vault, races: Set<string>) {}

  placeNVaultMonsters(pt: Loc, depth: number, number: number) {
    if (!this.isInbounds(pt)) return

    for (let k = 0; k < number; k++) {
      for (let i = 0; i < 9; i++) {
        const ps = this.findMonsterPlacements(pt, 1, 1, true, (p) => {
          return this.tiles.get(p).isEmpty()
        })
        if (ps.length === 0) continue
        this.pickAndPlaceMonster(ps[0], depth, true, true, ORIGIN.DROP_SPECIAL)
        break
      }
    }
  }

  placeTrap(pt: Loc, idx: number, level: number) {}
  placeGold(pt: Loc, depth: number, origin: ORIGIN) {}
  placeObject(pt: Loc, level: number, good: boolean, great: boolean, origin: ORIGIN, type: TV) {}

  // TODO: Can simplify algo here
  placeNVaultObjects(pt: Loc, depth: number, number: number) {
    const b = pt.box(5, 7)

    while(number > 0) {
      for (let i = 0; i < 11; i++) {
        // these loops could be combined; we could just put a cap on find nearby
        // grid
        const p1 = this.findNearbyGrid(b)
        if (p1 == null) throw new Error('could not place object')

        if (!this.tiles.get(pt).canPutItem()) continue

        if (oneIn(4)) {
          this.placeGold(p1, depth, ORIGIN.VAULT)
        } else {
          this.placeObject(p1, depth, false, false, ORIGIN.SPECIAL, 0)
        }

        break
      }
      number--
    }
  }

  setMarkedGranite(pt: Loc, flag?: SQUARE) {
    const tile = this.tiles.get(pt)
    tile.feature = FeatureRegistry.get(FEAT.GRANITE)
    if (flag) tile.turnOn(flag)
  }

  // this should be the only code setting features
  setFeature(tile: Tile, _feature: Feature | FEAT) {
    const feature = typeof _feature === 'number' ? FeatureRegistry.get(_feature) : _feature

    this.featureCount[tile.feature.code]--
    this.featureCount[feature.code]++

    tile.feature = feature
    if (feature.isBright()) {
      tile.turnOn(SQUARE.GLOW)
    }
    // TODO: if character_dungeon (what's the alternative?)
    // TODO: traps
    // TODO: square_note_spot
    // TODO: square_light_spot
  }

  hasLOS(p1: Loc, p2: Loc): boolean {
    // TODO: Implement
    return true
  }

  // scatter_ext
  findMonsterPlacements(
    center: Loc,
    distance: number,
    number: number,
    needLos?: boolean,
    pred?: (pt: Loc) => boolean
  ): Loc[] {
    const bounds = center.boxR(distance)
    const possibilities = []

    // all fully inbounds
    const clipped = this.box.interior().intersect(bounds)

    for (const pt of clipped) {
      if (distance > 1 && center.dist(pt) > distance) continue
      if (needLos && !this.hasLOS(center, pt)) continue
      if (pred && !pred(pt)) continue
      possibilities.push(pt)
    }

    const results = []
    let remaining = possibilities.length

    while (results.length < number && remaining > 0) {
      const choice = randInt0(remaining)
      results.push(possibilities[choice])

      remaining--
      possibilities[choice] = possibilities[remaining]
    }

    return results
  }

  findNearbyGrid(bounds: Box): Loc | undefined {
    for (const p of this.tiles.randomly(bounds)) {
      if (this.isFullyInbounds(p)) return p
    }
  }

  countNeighbors(pt: Loc, countSelf: boolean, fn: (tile: Tile, pt: Loc, chunk: this) => boolean) {
    let count = 0

    for (const neighbor of getNeighbors(pt, countSelf)) {
      if (!this.isInbounds(neighbor)) continue
      const tile = this.tiles.get(neighbor)
      if (!fn(tile, neighbor, this)) continue

      count++
    }

    return count
  }

  surrounds(b: Box): boolean {
    return this.box.surrounds(b)
  }

  isInbounds(pt: Loc) {
    return this.tiles.contains(pt)
  }

  isFullyInbounds(pt: Loc) {
    return this.tiles.fullyContains(pt)
  }
}
