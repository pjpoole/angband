import { box, Box, loc, Loc } from '../core/loc'
import { oneIn, randInt0, randInt1 } from '../core/rand'
import { getNeighbors } from '../utilities/directions'
import { asInteger } from '../utilities/parsing/primitives'
import { Rectangle } from '../utilities/rectangle'
import {
  SymmetryTransform,
  symmetryTransform
} from './roomGenerators/helpers/symmetry'

import { FEAT, Feature, FeatureRegistry } from './features'
import { ROOMF, RoomTemplate } from './roomTemplate'
import { SQUARE } from './square'
import { Tile } from './tile'

interface CaveParams {
  height: number
  width: number
  depth: number
  fill?: Feature | FEAT
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

  private readonly tiles: Rectangle<Tile>

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

    this.tiles = new Rectangle(this.width, this.height, (pt: Loc): Tile => {
      const tile = new Tile(pt, fill, params.flag)
      this.featureCount[tile.feature.code] += 1
      return tile
    })
  }

  get box() {
    return this.tiles.box
  }

  turnOn(p: Loc, flag: SQUARE) {
    this.tiles.get(p).turnOn(flag)
  }

  turnOff(p: Loc, flag: SQUARE) {
    this.tiles.get(p).turnOff(flag)
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

  // generation
  setBorderingWalls(b: Box) {
    const clipped = this.tiles.clip(b)
    const topLeft = loc(clipped.left, clipped.top)

    const refToOffset = (p: Loc): Loc => p.diff(topLeft)
    const offsetToRef = (p: Loc): Loc => p.sum(topLeft)

    const walls = new Rectangle(b.height, b.width, true)

    this.tiles.forEachInRange(clipped, (tile, pt) => {
      if (!tile.isFloor()) {
        assert(!tile.isRoom())
        return
      }

      assert(tile.isRoom())

      const neighbors = this.tiles.clip(pt.box(3))

      if (neighbors.height !== 3 || neighbors.width !== 3) {
        // we hit the edge of the map
        walls.set(refToOffset(pt), true)
      } else {
        let floorCount = 0
        this.tiles.forEachInRange(neighbors, (tile) => {
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

  generateBasicRoom(
    b: Box,
    light: boolean,
  ): void {
    const outerBox = b.exterior()
    this.generateRoom(outerBox, light)
    this.drawRectangle(outerBox, FEAT.GRANITE, SQUARE.WALL_OUTER, false)
    this.fillRectangle(b, FEAT.FLOOR, SQUARE.NONE)
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

    template.room.forEach((char, ptPre) => {
      if (char === ' ') return

      const p = symmetryTransform(ptPre, center, height, width, rotate, reflect)
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
            // TODO: trap
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
          if (randInt0(100) < 80) {
            // TODO: place object
          } else {
            // TODO: place random stairs
          }
          break
        case '9':
          // handled in second pass
          break
        case '[':
          // TODO: place object
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
          const doorNum = asInteger(char)
          if (doorNum == randomDoor) this.placeSecretDoor(p)
          else this.setMarkedGranite(p, SQUARE.WALL_SOLID)
          break
      }

      tile.turnOn(SQUARE.ROOM)
      if (light) tile.turnOn(SQUARE.GLOW)
    })

    // Second pass to place items after first pass has completed
    template.room.forEach((char, ptPre) => {
      const pt = symmetryTransform(ptPre, center, height, width, rotate, reflect)
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
          // TODO: Monsters
          break
        case '9':
          assert(tile.isRoom() && tile.isFloor())
          // TODO: Monsters
          // TODO: Object
          break
      }
    })

    return true
  }

  // TODO: Check to see how this is used; if it's always used in conjunction
  //       with other functions (border, floor) it may be possible to roll all
  //       of these up together
  generateRoom(b: Box, light: boolean) {
    this.tiles.forEachInRange(b, (tile) => {
      tile.turnOn(SQUARE.ROOM)
      if (light) tile.turnOn(SQUARE.GLOW)
    })
  }

  generatePlus(b: Box, feature: Feature | FEAT, flag?: SQUARE) {
    const center = b.center()

    this.tiles.forEachInRange(box(center.x, b.top, center.x, b.bottom), (tile) => {
      this.setFeature(tile, feature)
      if (flag) tile.turnOn(flag)
    })

    this.tiles.forEachInRange(box(b.left, center.y, b.right, center.y), (tile) => {
      this.setFeature(tile, feature)
      if (flag) tile.turnOn(flag)
    })
  }

  fillRectangle(b: Box, feature: Feature | FEAT, flag?: SQUARE) {
    this.tiles.forEachInRange(b, (tile) => {
      this.setFeature(tile, feature)
      if (flag) tile.turnOn(flag)
    })
  }

  fillHorizontal(
    y: number,
    xStart: number,
    xEnd: number,
    feature: Feature | FEAT,
    flag?: SQUARE,
    light?: boolean,
  ) {
    this.tiles.forEachInRange(box(xStart, y, xEnd, y), (tile) => {
      this.setFeature(tile, feature)
      tile.turnOn(SQUARE.ROOM)
      if (flag) tile.turnOn(flag)
      if (light) tile.turnOn(SQUARE.GLOW)
    })
  }

  fillVertical(
    x: number,
    yStart: number,
    yEnd: number,
    feature: Feature | FEAT,
    flag?: SQUARE,
    light?: boolean,
  ) {
    this.tiles.forEachInRange(box(x, yStart, x, yEnd), (tile) => {
      this.setFeature(tile, feature)
      tile.turnOn(SQUARE.ROOM)
      if (flag) tile.turnOn(flag)
      if (light) tile.turnOn(SQUARE.GLOW)
    })
  }

  drawRectangle(
    b: Box,
    feature: Feature | FEAT,
    flag?: SQUARE,
    overwritePermanent?: boolean
  ) {
    this.tiles.forEachBorder(b, (tile) => {
      if (overwritePermanent || !tile.isPermanent()) {
        this.setFeature(tile, feature)
      }
      if (flag) tile.turnOn(flag)
    })
  }

  // Unused; ugly function
  // Keeping it for discoverability reasons
  generateMark(
    b: Box,
    flag: SQUARE,
  ) {
    this.tiles.forEachInRange(b, (tile) => { tile.turnOn(flag) })
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

  isInbounds(pt: Loc) {
    return this.tiles.contains(pt)
  }

  isFullyInbounds(pt: Loc) {
    return this.tiles.fullyContains(pt)
  }
}
