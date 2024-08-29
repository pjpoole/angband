import { loc } from '../common/core/loc'
import { DIR, moveDir } from '../common/utilities/directions'

import { Entity } from '../common/game/Entity'
import { loadGameObjects } from './game/loadData'

import { GameMap } from '../common/game/Map'
import { CommandMap, COMMANDS } from './commands'
import { loadTestRoom } from './testTerrain'

document.addEventListener('DOMContentLoaded', () => {
  loadGameObjects()
  const mapData = loadTestRoom()
  const map = new GameMap(mapData)
  const player = new Entity()

  player.add(map, loc(40, 15))

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

    // Hack; TODO: need val check
    const pt = player.pt ?? loc(-1, -1)

    switch (command) {
      case COMMANDS.MOVE_EAST: {
        player.move(moveDir(pt, DIR.EAST))
        break
      }
      case COMMANDS.MOVE_NORTHEAST: {
        player.move(moveDir(pt, DIR.NORTHEAST))
        break
      }
      case COMMANDS.MOVE_NORTH: {
        player.move(moveDir(pt, DIR.NORTH))
        break
      }
      case COMMANDS.MOVE_NORTHWEST: {
        player.move(moveDir(pt, DIR.NORTHWEST))
        break
      }
      case COMMANDS.MOVE_WEST: {
        player.move(moveDir(pt, DIR.WEST))
        break
      }
      case COMMANDS.MOVE_SOUTHWEST: {
        player.move(moveDir(pt, DIR.SOUTHWEST))
        break
      }
      case COMMANDS.MOVE_SOUTH: {
        player.move(moveDir(pt, DIR.SOUTH))
        break
      }
      case COMMANDS.MOVE_SOUTHEAST: {
        player.move(moveDir(pt, DIR.SOUTHEAST))
        break
      }
    }

    gameWindow.innerText = map.draw()
  })
})
