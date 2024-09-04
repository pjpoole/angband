import { initializeMap } from '../game/init'

import { getCave, getRandomRoom } from './roomRaster'

export function drawCave(roomName?: string, depth?: number) {
  const cave = getCave(roomName, depth)
  initializeMap(cave)
}

export function drawRoom(roomName?: string, depth?: number) {
  const cave = getRandomRoom(roomName, depth)
  initializeMap(cave)
}
