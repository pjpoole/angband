import { box, Box, Loc } from '../core/loc'
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
  checkForUnreservedBlocks(b: Box): boolean {
    assertInitialized(this.roomMap)
    if (!this.roomMap.surrounds(b)) return false
    return this.roomMap.every(b, (cell) => !cell)
  }

  reserveBlocks(b: Box) {
    assertInitialized(this.roomMap)

    for (const p of this.roomMap.coordinates(b)) {
      this.roomMap.set(p, true)
    }
  }

  findSpace(b: Box): Loc | undefined {
    const blocksHigh = 1 + Math.trunc((b.height - 1) / this.blockHeight)
    const blocksWide = 1 + Math.trunc((b.width - 1) / this.blockWidth)

    let newCenter = b.center()
    for (let i = 0; i < MAX_TRIES; i++) {
      // random starting block in the dungeon
      const left = randInt0(this._blockColumns)
      const top = randInt0(this._blockRows)
      const newBox = box(left, top, left + blocksWide - 1, top + blocksHigh -1)

      if (!this.checkForUnreservedBlocks(newBox)) continue

      newCenter = newBox.center()
      this.addCenter(newCenter)
      this.reserveBlocks(newBox)

      return newCenter
    }

    return
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
      this.roomMap = new Rectangle(this._blockRows, this._blockColumns, false)
    }
  }
}
