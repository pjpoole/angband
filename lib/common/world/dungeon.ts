import { DungeonProfile } from './dungeonProfiles'
import { Coord } from '../core/coordinate'
import { Rectangle } from '../utilities/rectangle'

interface DungeonParams {
  profile: DungeonProfile
  persist: boolean
  quest: boolean
}

function assertInitialized<T>(value: T): asserts value is NonNullable<T> {
  if (value == null) {
    throw new Error('value not yet initialized')
  }
}

export class Dungeon {
  readonly profile: DungeonProfile
  private readonly persist: boolean
  readonly quest: boolean

  numPits: number = 0
  numCenters: number = 0

  // set externally in four cases: classic, modified, moria, lair
  blockHeight: number = 0
  blockWidth: number = 0

  private _blockRows: number = 0
  private _blockColumns: number = 0

  roomMap?: Rectangle<boolean>

  centers: [number, number][]

  constructor(params: DungeonParams) {
    this.profile = params.profile
    this.persist = params.persist
    this.quest = params.quest

    this.centers = []
  }

  // generation
  checkForUnreservedBlocks(p1: Coord, p2: Coord): boolean {
    assertInitialized(this.roomMap)
    return this.roomMap.everyCellInRange(p1, p2, (cell) => !cell)
  }

  reserveBlocks(p1: Coord, p2: Coord) {
    assertInitialized(this.roomMap)
    this.roomMap.eachCellInRange(p1, p2, () => true)
  }

  addCenter(x: number, y: number) {
    this.centers.push([x, y])
  }

  popCenter() {
    this.centers.pop()
  }

  set blockRows(value: number) {
    this._blockRows = value
    this.maybeInitRoomMap()
  }

  set blockColumns(value: number) {
    this._blockColumns = value
    this.maybeInitRoomMap()
  }

  private maybeInitRoomMap() {
    if (this._blockColumns > 0 && this._blockRows > 0) {
      this.roomMap = new Rectangle(this._blockColumns, this._blockRows, false)
    }
  }
}
