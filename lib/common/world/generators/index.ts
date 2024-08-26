import { generate as generateCavern } from './cavern'
import { generate as generateClassic } from './classic'
import { generate as generateGauntlet } from './gauntlet'
import { generate as generateHardCenter } from './hardCenter'
import { generate as generateLabyrinth } from './labyrinth'
import { generate as generateLair } from './lair'
import { generate as generateMoria } from './moria'
import { generate as generateModified } from './modified'
import { generate as generateTown } from './town'
import { DUN } from '../dungeonProfiles'
import { Player } from '../../player/player'

export type DungeonGenerator = (player: Player, minHeight: number, minWidth: number) => any

export const GENERATORS: Record<DUN, DungeonGenerator> = {
  [DUN.town]: generateTown,
  [DUN.modified]: generateModified,
  [DUN.moria]: generateMoria,
  [DUN.lair]: generateLair,
  [DUN.gauntlet]: generateGauntlet,
  [DUN['hard centre']]: generateHardCenter,
  [DUN.labyrinth]: generateLabyrinth,
  [DUN.cavern]: generateCavern,
  [DUN.classic]: generateClassic,
} as const
