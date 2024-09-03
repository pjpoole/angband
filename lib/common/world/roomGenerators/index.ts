import { box, loc, Loc } from '../../core/loc'
import { getConstants } from '../../core/loading'
import { randEl } from '../../core/rand'
import { debug } from '../../utilities/diagnostic'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { Room } from '../dungeonProfiles'

import * as circular from './circular'
import * as crossed from './crossed'
import * as greaterVault from './greaterVault'
import * as greaterVaultNew from './greaterVaultNew'
import * as huge from './huge'
import * as interesting from './interesting'
import * as large from './large'
import * as lesserVault from './lesserVault'
import * as lesserVaultNew from './lesserVaultNew'
import * as mediumVault from './mediumVault'
import * as mediumVaultNew from './mediumVaultNew'
import * as moria from './moria'
import * as nest from './nest'
import * as overlap from './overlap'
import * as pit from './pit'
import * as roomOfChambers from './roomOfChambers'
import * as simple from './simple'
import * as staircase from './staircase'
import * as template from './template'

// TODO: Take params, like depth
// TODO: Debug log what params were used (in generator, probably)
export function buildRandomRoom(): Cave | null {
  const choice = randEl(ROOM)
  debug(`Using ${choice.name}...`)
  return choice.file.buildRoom()
}

type RoomBuilder = (
  dungeon: Dungeon,
  chunk: Cave,
  pt: Loc,
  rating: number,
) => boolean

export type RoomName = 'Greater vault (new)' | 'Greater vault' | 'Interesting room'
  | 'Lesser vault (new)' | 'Lesser vault' | 'Medium vault (new)'
  | 'Medium vault' | 'circular room' | 'crossed room' | 'huge room'
  | 'large room' | 'monster nest' | 'monster pit' | 'moria room'
  | 'overlap room' | 'room of chambers' | 'room template' | 'simple room'
  | 'staircase room'

interface RoomEntry {
  name: RoomName
  rows: number
  cols: number
  file: any
}

// list-rooms.h
const ROOM: RoomEntry[] = [
  { name: 'staircase room', rows: 0, cols: 0, file: staircase },
  { name: 'simple room', rows: 0, cols: 0, file: simple },
  { name: 'moria room', rows: 0, cols: 0, file: moria },
  { name: 'large room', rows: 0, cols: 0, file: large },
  { name: 'crossed room', rows: 0, cols: 0, file: crossed },
  { name: 'circular room', rows: 0, cols: 0, file: circular },
  { name: 'overlap room', rows: 0, cols: 0, file: overlap },
  { name: 'room template', rows: 11, cols: 33, file: template },
  { name: 'Interesting room', rows: 40, cols: 50, file: interesting },
  { name: 'monster pit', rows: 0, cols: 0, file: pit },
  { name: 'monster nest', rows: 0, cols: 0, file: nest },
  { name: 'huge room', rows: 0, cols: 0, file: huge },
  { name: 'room of chambers', rows: 0, cols: 0, file: roomOfChambers },
  { name: 'Lesser vault', rows: 22, cols: 22, file: lesserVault },
  { name: 'Medium vault', rows: 22, cols: 33, file: mediumVault },
  { name: 'Greater vault', rows: 44, cols: 66, file: greaterVault },
  { name: 'Lesser vault (new)', rows: 22, cols: 22, file: lesserVaultNew },
  { name: 'Medium vault (new)', rows: 22, cols: 33, file: mediumVaultNew },
  { name: 'Greater vault (new)', rows: 44, cols: 66, file: greaterVaultNew },
]

export function buildRoom(
  dungeon: Dungeon,
  chunk: Cave,
  bpt: Loc,
  profile: Room,
  findsOwnSpace: boolean
): boolean {
  if (chunk.depth < profile.level) return false
  if (profile.pit && dungeon.numPits >= getConstants().dungeonGeneration.pitMax) return false

  // block box; scaled to block height / width
  const bb = box(
    bpt.x,
    bpt.y,
    bpt.x + Math.ceil(profile.width / dungeon.blockWidth),
    bpt.y + Math.ceil(profile.height / dungeon.blockHeight),
  )

  const builder = findBuilder(profile.name)

  if (findsOwnSpace) {
    if (!builder(dungeon, chunk, loc(chunk.width, chunk.height), profile.rating)) {
      return false
    }
  } else {
    if (!dungeon.checkForUnreservedBlocks(bb)) {
      return false
    }

    // actual point, not block point
    const center = loc(
      Math.trunc((bb.left + bb.right + 1) * dungeon.blockWidth / 2),
      Math.trunc((bb.top + bb.bottom + 1) * dungeon.blockHeight / 2)
    )

    // per C comments, this has to be available in the dungeon for proper
    // entrance calculation
    dungeon.addCenter(center)

    if (!builder(dungeon, chunk, center, profile.rating)) {
      // TODO: figure out if we can simply put this in the builder
      dungeon.popCenter()
      return false
    }

    dungeon.reserveBlocks(bb)
  }

  if (profile.pit) dungeon.numPits++

  // TODO: remove before flight
  return true
}

export function isValidRoomName(name: string): name is RoomName {
  for (const room of ROOM) {
    if (room.name === name) return true
  }

  return false
}

function findBuilder(name: string): RoomBuilder {
  for (const room of ROOM) {
    if (room.name === name) {
      return room.file.build
    }
  }

  throw new Error('invalid room name')
}
