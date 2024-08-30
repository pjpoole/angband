import { Box, loc, Loc } from '../core/loc'
import { oneIn, randInt0, randInt1 } from '../core/rand'

import { getNeighbors } from '../utilities/directions'
import { asInteger } from '../utilities/parsing/primitives'
import { Rectangle } from '../utilities/rectangle'

import { FEAT, Feature, FeatureRegistry } from './features'
import { ORIGIN } from '../objects/origin'
import { ROOMF, RoomTemplate } from './roomTemplate'
import { SQUARE } from './square'
import { Tile } from './tile'

import {
  placeNVaultMonsters
} from './roomGenerators/helpers/monster'
import {
  placeNVaultObjects,
  placeObject
} from './roomGenerators/helpers/object'
import {
  SymmetryTransform,
  symmetryTransform
} from './roomGenerators/helpers/symmetry'


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
  placeTrap(pt: Loc, idx: number, level: number) {}
  placeGold(pt: Loc, depth: number, origin: ORIGIN) {}

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
