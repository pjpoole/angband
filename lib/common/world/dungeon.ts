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

  constructor(params: DungeonParams) {
    this.profile = params.profile
    this.persist = params.persist
    this.quest = params.quest

    this.roomMap = [[]]
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
