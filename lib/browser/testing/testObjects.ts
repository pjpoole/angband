import { isQuest } from '../../common/game/quest'
import { BirthOptions, Player } from '../../common/player/player'
import { Cave } from '../../common/world/cave'
import { Dungeon } from '../../common/world/dungeon'
import { DungeonProfileRegistry } from '../../common/world/dungeonProfiles'
import { DUN } from '../../common/world/dungeonTypes'
import { FEAT } from '../../common/world/features'
import { SQUARE } from '../../common/world/square'

export function getObjects(depth?: number): [Dungeon, Cave, Player] {
  const player = buildPlayer()
  player.depth = depth ?? 50

  const dungeon = buildDungeon(player)

  const cave = new Cave({
    height: 50,
    width: 100,
    depth: player.depth,
    fill: FEAT.GRANITE,
    flag: SQUARE.NONE,
  })

  dungeon.blockHeight = dungeon.profile.blockSize
  dungeon.blockWidth = dungeon.profile.blockSize
  const blockRows = Math.trunc(cave.height / dungeon.blockHeight)
  const blockColumns = Math.trunc(cave.width / dungeon.blockWidth)
  dungeon.blockRows = blockRows
  dungeon.blockColumns = blockColumns

  return [dungeon, cave, player]
}

export function buildDungeon(player: Player) {
  return new Dungeon({
    profile: DungeonProfileRegistry.get(DUN.classic),
    persist: player.options.birth.levelsPersist,
    quest: isQuest(player, player.depth),
  })
}

export function buildPlayer() {
  return new Player(getPlayerParams())
}

function getPlayerParams() {
  return {
    options: {
      birth: new BirthOptions({})
    }
  }
}
