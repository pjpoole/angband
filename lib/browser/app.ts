import { Loc, loc } from '../common/core/loc'
import { DIR, moveDir } from '../common/utilities/directions'

import { Entity } from '../common/game/Entity'
import { loadGameObjects } from './game/loadData'

import { GameMap } from '../common/game/Map'
import { FEAT } from '../common/world/features'
import { COMMANDS, getCommand } from './commands'

import { getCave } from './testing/roomRaster'
import { loadTestRoom } from './testing/testTerrain'
import { randInt0 } from '../common/core/rand'
import { Cave } from '../common/world/cave'

// @ts-ignore
window.drawCave = drawCave

function drawCave(roomName?: string, depth?: number) {
  const cave = getCave(roomName, depth)
  run(cave)
}

function processCave(cave: Cave): [FEAT[][], Loc] {
  const mapData: FEAT[][] = [[]]
  const openPoints: Loc[] = []
  cave.tiles.forEach((tile, pt, newRow) => {
    if (newRow) mapData.push([])
    if (tile.isOpen()) openPoints.push(pt)
    mapData[mapData.length - 1].push(tile.feature.code)
  })

  const playerLocation = openPoints[randInt0(openPoints.length)]

  return [mapData, playerLocation]
}

let _player: Entity
let _map: GameMap

document.addEventListener('DOMContentLoaded', () => {
  loadGameObjects()
  _player = new Entity()
  run()
  window.addEventListener('keydown', handleCommand)
})

function setMap(map: GameMap) {
  _map = map
}

function getMap(): GameMap {
  return _map
}

function getPlayer(): Entity {
  return _player
}

function update(data: string) {
  const gameWindow = document.getElementById('main')
  if (!gameWindow) throw new Error('missing root game element')
  gameWindow.innerText = data
}

function run(cave?: Cave) {
  const [mapData, position] = cave
    ? processCave(cave)
    : [loadTestRoom(), loc(40, 15)]
  const map = new GameMap(mapData)
  setMap(map)
  const player = getPlayer()
  player.add(map, position)
  update(map.draw())
}

function handleCommand(ev: KeyboardEvent) {
  const command = getCommand(ev.key, ev.ctrlKey, ev.altKey, ev.metaKey)

  if (command == null) return

  ev.preventDefault()
  ev.stopPropagation()

  const player = getPlayer()
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

  update(getMap().draw())
}
