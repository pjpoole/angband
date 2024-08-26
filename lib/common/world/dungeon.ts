import { DungeonProfile } from './dungeonProfiles'

interface DungeonParams {
  profile: DungeonProfile
  persist: boolean
  quest: boolean
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

  roomMap: boolean[][]

  centers: [number, number][]

  constructor(params: DungeonParams) {
    this.profile = params.profile
    this.persist = params.persist
    this.quest = params.quest

    this.roomMap = [[]]

    this.centers = []
  }

  // generation
  checkForUnreservedBlocks(x1: number, y1: number, x2: number, y2: number): boolean {
    if (x1 < 0 || x2 >= this._blockColumns) return false
    if (y1 < 0 || y2 >= this._blockRows) return false

    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) {
        if (this.roomMap[y][x]) return false
      }
    }

    return true
  }

  reserveBlocks(x1: number, y1: number, x2: number, y2: number) {
    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) {
        this.roomMap[y][x] = true
      }
    }
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
      this.roomMap = new Array(this._blockRows)
      for (let y = 0; y < this._blockRows; y++) {
        this.roomMap[y] = new Array(this._blockColumns)
      }
    }
  }
}
