import { loc, Loc, locsToBox, wellOrdered } from '../core/loc'
import { oneIn, randInt0, randInt1 } from '../core/rand'
import { getNeighbors } from '../utilities/directions'
import { asInteger } from '../utilities/parsing/primitives'
import { Rectangle } from '../utilities/rectangle'
import {
  SymmetryTransform,
  symmetryTransform
} from './roomGenerators/helpers/symmetry'

import { FEAT, Feature, FeatureRegistry } from './features'
import { SQUARE } from './square'
import { ROOMF, RoomTemplate } from './roomTemplate'
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
  setBorderingWalls(p1: Loc, p2: Loc) {
    // TODO: We have better helpers for this
    const boundLeft = Math.max(0, Math.min(p1.x, p2.x))
    const boundRight = Math.min(this.width - 1, Math.max(p1.x, p2.x))
    const boundTop = Math.max(0, Math.min(p1.y, p2.y))
    const boundBottom = Math.min(this.height - 1, Math.max(p1.y, p2.y))

    const bp1 = loc(boundLeft, boundTop)
    const bp2 = loc(boundRight, boundBottom)

    const refToOffset = (p: Loc): Loc => p.diff(bp1)
    const offsetToRef = (p: Loc): Loc => p.sum(bp1)

    const wallWidth = Math.abs(p1.x - p2.x)
    const wallHeight = Math.abs(p1.y - p2.y)
    const walls = new Rectangle(wallHeight, wallWidth, true)

    let yAbove = Math.max(0, bp1.y - 1)
    let yBelow = Math.min(this.height - 1, bp1.y + 1)
    let xLeft, xRight
    // Edge detection
    this.tiles.forEachInRange(bp1, bp2, (tile, pt, newRow) => {
      if (newRow) {
        yAbove = Math.max(0, pt.y - 1)
        yBelow = Math.min(this.height - 1, pt.y + 1)
      }

      if (!tile.isFloor()) {
        assert(!tile.isRoom())
        return
      }

      xLeft = Math.max(0, pt.x - 1)
      xRight = Math.min(this.width - 1, pt.x + 1)

      assert(tile.isRoom())

      if (yBelow - yAbove !== 2 || xRight - xLeft !== 2) {
        // we hit the edge of the map
        walls.set(refToOffset(pt), true)
      } else {
        let floorCount = 0
        this.tiles.forEachInRange(loc(xLeft, yAbove), loc(xRight, yBelow), (tile) => {
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
        const pt1 = offsetToRef(pt)
        const tile = this.tiles.get(pt1)
        assert(tile.isFloor() && tile.isRoom())
        this.setMarkedGranite(pt1, SQUARE.WALL_OUTER)
      }
    })
  }

  generateBasicRoom(
    p1: Loc,
    p2: Loc,
    light: boolean,
  ): void {
    const [topLeft, bottomRight] = wellOrdered(p1, p2)

    const outerTopLeft = topLeft.offset(-1)
    const outerBottomRight = bottomRight.offset(1)
    this.generateRoom(outerTopLeft, outerBottomRight, light)
    this.drawRectangle(outerTopLeft, outerBottomRight, FEAT.GRANITE, SQUARE.WALL_OUTER, false)
    this.fillRectangle(topLeft, bottomRight, FEAT.FLOOR, SQUARE.NONE)
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
  generateRoom(
    p1: Loc,
    p2: Loc,
    light: boolean,
  ) {
    this.tiles.forEachInRange(p1, p2, (tile) => {
      tile.turnOn(SQUARE.ROOM)
      if (light) tile.turnOn(SQUARE.GLOW)
    })
  }

  generatePlus(
    p1: Loc,
    p2: Loc,
    feature: Feature | FEAT,
    flag?: SQUARE,
  ) {
    const center = locsToBox(p1, p2).center()

    this.tiles.forEachInRange(loc(center.x, p1.y), loc(center.x, p2.y), (tile) => {
      this.setFeature(tile, feature)
      if (flag) tile.turnOn(flag)
    })

    this.tiles.forEachInRange(loc(p1.x, center.y), loc(p2.x, center.y), (tile) => {
      this.setFeature(tile, feature)
      if (flag) tile.turnOn(flag)
    })
  }

  fillRectangle(
    p1: Loc,
    p2: Loc,
    feature: Feature | FEAT,
    flag?: SQUARE,
  ) {
    this.tiles.forEachInRange(p1, p2, (tile) => {
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
    this.tiles.forEachInRange(loc(xStart, y), loc(xEnd, y), (tile) => {
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
    this.tiles.forEachInRange(loc(x, yStart), loc(x, yEnd), (tile) => {
      this.setFeature(tile, feature)
      tile.turnOn(SQUARE.ROOM)
      if (flag) tile.turnOn(flag)
      if (light) tile.turnOn(SQUARE.GLOW)
    })
  }

  drawRectangle(
    p1: Loc,
    p2: Loc,
    feature: Feature | FEAT,
    flag?: SQUARE,
    overwritePermanent?: boolean
  ) {
    this.tiles.forEachBorder(p1, p2, (tile) => {
      if (overwritePermanent || !tile.isPermanent()) {
        this.setFeature(tile, feature)
      }
      if (flag) tile.turnOn(flag)
    })
  }

  // Unused; ugly function
  // Keeping it for discoverability reasons
  generateMark(
    p1: Loc,
    p2: Loc,
    flag: SQUARE,
  ) {
    this.tiles.forEachInRange(p1, p2, (tile) => { tile.turnOn(flag) })
  }

  // TODO: Maybe return coord of hole
  generateHole(p1: Loc, p2: Loc, feature: Feature | FEAT) {
    const center = locsToBox(p1, p2).center()

    let { x, y } = center
    // pick a random wall center
    switch (randInt0(4)) {
      case 0: y = p1.y; break
      case 1: x = p1.x; break
      case 2: y = p2.y; break
      case 3: y = p2.y; break
    }
    const point = loc(x, y)

    // can only happen in degenerate cases
    assert(!point.eq(center))

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
