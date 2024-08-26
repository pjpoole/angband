import { findByAlloc, oneIn, randInt0 } from '../core/rand'
import { isQuest } from '../game/quest'
import { Player } from '../player/player'

import { DUN, DungeonProfile, DungeonProfileRegistry } from './dungeonProfiles'
import { Dungeon } from './dungeon'

export function caveGenerate(player: any, height: number, width: number) {
  const dungeon = new Dungeon({
    profile: chooseProfile(player),
    persist: player.options.birth.persist,
    quest: isQuest(player, player.depth),
  })
}

function chooseProfile(player: Player): DungeonProfile {
  let profile
  const labyrinthAlloc = DungeonProfileRegistry.get(DUN.labyrinth).allocation
  const moriaAlloc = DungeonProfileRegistry.get(DUN.moria).allocation

  if (player.depth === 0) {
    profile = DungeonProfileRegistry.get(DUN['town'])
  } else if (isQuest(player, player.depth)) {
    profile = DungeonProfileRegistry.get(DUN['classic'])
  } else if (
    shouldMakeLabyrinth(player.depth) &&
    (labyrinthAlloc > 0 || labyrinthAlloc === -1)
  ) {
    profile = DungeonProfileRegistry.get(DUN['labyrinth'])
  } else if (
    player.depth >= 10 && player.depth < 40 && oneIn(40) &&
    (moriaAlloc > 0 || moriaAlloc === -1)
  ) {
    profile = DungeonProfileRegistry.get(DUN['moria'])
  } else {
    profile = findByAlloc('allocation', DungeonProfileRegistry)
  }

  if (profile) return profile

  // should never happen
  throw new Error('failed to find dungeon profile')
}

function shouldMakeLabyrinth(depth: number) {
  let chance = 2

  if (depth < 13) return false
  if (depth % 3 === 0) chance += 1
  if (depth % 5 === 0) chance += 1
  if (depth % 7 === 0) chance += 1
  if (depth % 11 === 0) chance += 1
  if (depth % 13 === 0) chance += 1

  return randInt0(100) < chance
}
