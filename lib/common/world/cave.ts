import {
  cCenter,
  cEq,
  cOffset,
  Coord,
  cToWellOrdered
} from '../core/coordinate'
import { oneIn, randInt0, randInt1 } from '../core/rand'
import { Rectangle } from '../utilities/rectangle'

import { FEAT, Feature, FeatureRegistry } from './features'
import { SQUARE } from './square'
import { RoomTemplate } from './roomTemplate'
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

    this.tiles = new Rectangle(this.width, this.height, (pt: Coord): Tile => {
      const tile = new Tile(pt, fill, params.flag)
      this.featureCount[tile.feature.code] += 1
      return tile
    })
  }

  turnOn(pt: Coord, flag: SQUARE) {
    this.tiles.get(pt).turnOn(flag)
  }

  turnOff(pt: Coord, flag: SQUARE) {
    this.tiles.get(pt).turnOff(flag)
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
  setBorderingWalls(p1: Coord, p2: Coord) {
    const boundLeft = Math.max(0, Math.min(p1.x, p2.x))
    const boundRight = Math.min(this.width - 1, Math.max(p1.x, p2.x))
    const boundTop = Math.max(0, Math.min(p1.y, p2.y))
    const boundBottom = Math.min(this.height - 1, Math.max(p1.y, p2.y))

    const bp1 = { x: boundLeft, y: boundTop }
    const bp2 = { x: boundRight, y: boundBottom }

    const refToOffset = (pt: Coord) =>
      ({ x: pt.x - boundLeft, y: pt.y - boundTop })
    const offsetToRef = (pt: Coord) =>
      ({ x: pt.x + boundLeft, y: pt.y + boundTop })

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
        this.tiles.forEachInRange({ x: xLeft, y: yAbove }, { x: xRight, y: yBelow }, (tile) => {
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
    p1: Coord,
    p2: Coord,
    light: boolean,
  ): void {
    const [topLeft, bottomRight] = cToWellOrdered(p1, p2)
    const outerTopLeft = cOffset(topLeft, -1)
    const outerBottomRight = cOffset(bottomRight, 1)
    this.generateRoom(outerTopLeft, outerBottomRight, light)
    this.drawRectangle(outerTopLeft, outerBottomRight, FEAT.GRANITE, SQUARE.WALL_OUTER, false)
    this.fillRectangle(topLeft, bottomRight, FEAT.FLOOR, SQUARE.NONE)
  }

  buildRoomTemplate(
    center: Coord,
    template: RoomTemplate
  ): boolean {

    const light = this.depth <= randInt1(25)
    // Which random doors will we generate
    const randomDoor = randInt1(doors)
    // Do we generate optional walls
    const randomWalls = oneIn(2)


    template.room.forEach((char, pt) => {
      if (char === ' ') return

      const dest = symmetryTransform(pt, center, height, width, rotate, reflect)
      chunk.set(dest, FEAT.FLOOR)

    })

    return true
  }

  // TODO: Check to see how this is used; if it's always used in conjunction
  //       with other functions (border, floor) it may be possible to roll all
  //       of these up together
  generateRoom(
    p1: Coord,
    p2: Coord,
    light: boolean,
  ) {
    this.tiles.forEachInRange(p1, p2, (tile) => {
      tile.turnOn(SQUARE.ROOM)
      if (light) tile.turnOn(SQUARE.GLOW)
    })
  }

  generatePlus(
    p1: Coord,
    p2: Coord,
    feature: Feature | FEAT,
    flag?: SQUARE,
  ) {
    const center = cCenter(p1, p2)

    this.tiles.forEachInRange({ x: center.x, y: p1.y }, { x: center.x, y: p2.y }, (tile) => {
      this.setFeature(tile, feature)
      if (flag) tile.turnOn(flag)
    })

    this.tiles.forEachInRange({ x: p1.x, y: center.y }, { x: p2.x, y: center.y }, (tile) => {
      this.setFeature(tile, feature)
      if (flag) tile.turnOn(flag)
    })
  }

  fillRectangle(
    p1: Coord,
    p2: Coord,
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
    this.tiles.forEachInRange({ x: xStart, y }, { x: xEnd, y }, (tile) => {
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
    this.tiles.forEachInRange({ x, y: yStart }, { x, y: yEnd }, (tile) => {
      this.setFeature(tile, feature)
      tile.turnOn(SQUARE.ROOM)
      if (flag) tile.turnOn(flag)
      if (light) tile.turnOn(SQUARE.GLOW)
    })
  }

  drawRectangle(
    p1: Coord,
    p2: Coord,
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

  generateMark(
    p1: Coord,
    p2: Coord,
    flag: SQUARE,
  ) {
    this.tiles.forEachInRange(p1, p2, (tile) => { tile.turnOn(flag) })
  }

  generateHole(pt1: Coord, pt2: Coord, feature: Feature | FEAT) {
    const center = cCenter(pt1, pt2)

    const point = { ...center }
    // pick a random wall center
    switch (randInt0(4)) {
      case 0: point.y = pt1.y; break
      case 1: point.x = pt1.x; break
      case 2: point.y = pt2.y; break
      case 3: point.y = pt2.y; break
    }

    // can only happen in degenerate cases
    assert(!cEq(point, center))

    this.setFeature(this.tiles.get(point), feature)
  }

  placeClosedDoor(pt: Coord) {
    const tile = this.tiles.get(pt)
    this.setFeature(tile, FEAT.CLOSED)
    // TODO: traps: randomly set door lock strength
  }

  setMarkedGranite(pt: Coord, flag?: SQUARE) {
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
    // TOOD: square_light_spot
  }

  isInbounds(pt: Coord) {
    return this.tiles.isInbounds(pt)
  }

  isFullyInbounds(pt: Coord) {
    return this.tiles.isFullyInbounds(pt)
  }
}
