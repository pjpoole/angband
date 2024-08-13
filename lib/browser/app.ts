import { loadTestRoom } from './testTerrain'
import { GameMap } from '../common/game/Map'
import { Entity } from '../common/game/Entity'
import { CommandMap, COMMANDS } from './commands'

document.addEventListener('DOMContentLoaded', () => {
  const mapData = loadTestRoom()
  const map = new GameMap(mapData)
  const player = new Entity()

  player.add(map, 40, 15)

  const gameWindow = document.getElementById('main')

  if (!gameWindow) {
    throw new Error('missing root game element')
  }

  gameWindow.innerText = map.draw()

  window.addEventListener('keydown', (ev) => {
    const command = CommandMap[ev.key]

    if (command == null) return

    ev.preventDefault()
    ev.stopPropagation()

    if (!player.isOnMap()) return

    switch (command) {
      case COMMANDS.MOVE_EAST: {
        player.move(player.x + 1, player.y)
        break
      }
      case COMMANDS.MOVE_NORTHEAST: {
        player.move(player.x + 1, player.y - 1)
        break
      }
      case COMMANDS.MOVE_NORTH: {
        player.move(player.x, player.y - 1)
        break
      }
      case COMMANDS.MOVE_NORTHWEST: {
        player.move(player.x - 1, player.y - 1)
        break
      }
      case COMMANDS.MOVE_WEST: {
        player.move(player.x - 1, player.y)
        break
      }
      case COMMANDS.MOVE_SOUTHWEST: {
        player.move(player.x - 1, player.y + 1)
        break
      }
      case COMMANDS.MOVE_SOUTH: {
        player.move(player.x, player.y - 1)
        break
      }
      case COMMANDS.MOVE_SOUTHEAST: {
        player.move(player.x + 1, player.y - 1)
        break
      }
    }

    gameWindow.innerText = map.draw()
  })
})
