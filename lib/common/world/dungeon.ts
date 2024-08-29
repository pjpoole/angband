import { loc, Loc } from '../core/loc'
import { Rectangle } from '../utilities/rectangle'

import { DungeonProfile } from './dungeonProfiles'
import { randInt0 } from '../core/rand'

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

const MAX_TRIES = 25

export class Dungeon {
  readonly profile: DungeonProfile
  readonly persist: boolean
  readonly quest: boolean

  numPits: number = 0

  // set externally in four cases: classic, modified, moria, lair
  blockHeight: number = 0
  blockWidth: number = 0

  private _blockRows: number = 0
  private _blockColumns: number = 0

  roomMap?: Rectangle<boolean>

  centers: Loc[]

  constructor(params: DungeonParams) {
    this.profile = params.profile
    this.persist = false // TODO: implement params.persist
    this.quest = params.quest

    this.centers = []
  }

  // generation
  checkForUnreservedBlocks(p1: Loc, p2: Loc): boolean {
    assertInitialized(this.roomMap)
    return this.roomMap.every(p1, p2, (cell) => !cell)
  }

  reserveBlocks(p1: Loc, p2: Loc) {
    assertInitialized(this.roomMap)

    for (const p of this.roomMap.coordinates(p1, p2)) {
      this.roomMap.set(p, true)
    }
  }

  /*
   * MUTATES PT!
   *
   * TODO: See if there is a version of this that does not mutate
   */
  findSpace(
    p: Loc, height: number, width: number
  ): boolean {
    const blocksHigh = 1 + Math.trunc((height - 1) / this.blockHeight)
    const blocksWide = 1 + Math.trunc((width - 1) / this.blockWidth)

    for (let i = 0; i < MAX_TRIES; i++) {
      // random starting block in the dungeon
      const p1 = loc(randInt0(this.blockColumns), randInt0(this.blockRows))

      // QUESTION: why -1 ?
      const p2 = loc(p1.x + blocksWide - 1, p1.y + blocksHigh - 1)

      if (!this.checkForUnreservedBlocks(p1, p2)) continue

      // mutating here percolates up through the chain
      // TODO: change this and make Loc readonly again
      p.x = Math.trunc(((p1.x + p2.x + 1) * this.blockHeight) / 2)
      p.y = Math.trunc(((p1.y + p2.y + 1) * this.blockWidth) / 2)

      this.addCenter(p)
      this.reserveBlocks(p1, p2)

      return true
    }

    return false
  }

  // QUESTION: Always a block coord?
  // TODO: bounds checking against level_room_max
  addCenter(pt: Loc) {
    this.centers.push(pt)
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
