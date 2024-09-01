import * as cavern from './cavern'
import * as classic from './classic'
import * as gauntlet from './gauntlet'
import * as hardCenter from './hardCenter'
import * as labyrinth from './labyrinth'
import * as lair from './lair'
import * as moria from './moria'
import * as modified from './modified'
import * as town from './town'

import { Player } from '../../player/player'
import { Dungeon } from '../dungeon'
import { DUN } from '../dungeonTypes'

export type DungeonGenerator = (dungeon: Dungeon, player: Player, minHeight: number, minWidth: number) => any

export const GENERATORS: Record<DUN, DungeonGenerator> = {
  [DUN.town]: town.generate,
  [DUN.modified]: modified.generate,
  [DUN.moria]: moria.generate,
  [DUN.lair]: lair.generate,
  [DUN.gauntlet]: gauntlet.generate,
  [DUN['hard centre']]: hardCenter.generate,
  [DUN.labyrinth]: labyrinth.generate,
  [DUN.cavern]: cavern.generate,
  [DUN.classic]: classic.generate,
} as const
