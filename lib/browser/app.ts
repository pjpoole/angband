import { loadTestRoom } from './testTerrain'
import { GameMap } from '../common/game/Map'
import { Entity } from '../common/game/Entity'
import { CommandMap, COMMANDS } from './commands'
import { loadConstants, loadGameObjects } from './game/loadData'

document.addEventListener('DOMContentLoaded', () => {
  loadConstants()
  loadGameObjects()
  const mapData = loadTestRoom()
  const map = new GameMap(mapData)
  const player = new Entity()

  player.add(map, { x: 40, y: 15 })

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

    const { x, y } = player

    switch (command) {
      case COMMANDS.MOVE_EAST: {
        player.move({ x: x + 1, y })
        break
      }
      case COMMANDS.MOVE_NORTHEAST: {
        player.move({ x: x + 1, y: y - 1 })
        break
      }
      case COMMANDS.MOVE_NORTH: {
        player.move({ x, y: y - 1 })
        break
      }
      case COMMANDS.MOVE_NORTHWEST: {
        player.move({ x: x - 1, y: y - 1 })
        break
      }
      case COMMANDS.MOVE_WEST: {
        player.move({ x: x - 1, y })
        break
      }
      case COMMANDS.MOVE_SOUTHWEST: {
        player.move({ x: x - 1, y: y + 1 })
        break
      }
      case COMMANDS.MOVE_SOUTH: {
        player.move({ x, y: y + 1 })
        break
      }
      case COMMANDS.MOVE_SOUTHEAST: {
        player.move({ x: x + 1, y: y + 1 })
        break
      }
    }

    gameWindow.innerText = map.draw()
  })
})
