import { Entity } from '../common/game/Entity'

import { handleCommand } from './commands/handleCommand'
import { drawCells } from './drawing/init'
import { setPlayer } from './game/gameData'
import { initializeMap } from './game/init'
import { loadGameObjects } from './game/loadData'
import { drawCave, drawRoom } from './testing/testRooms'


// @ts-ignore
window.drawCave = drawCave
// @ts-ignore
window.drawRoom = drawRoom

document.addEventListener('DOMContentLoaded', () => {
  drawCells()
  loadGameObjects()
  setPlayer(new Entity())
  initializeMap()
  window.addEventListener('keydown', handleCommand)
})
