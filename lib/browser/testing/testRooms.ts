import { initializeMap } from '../game/init'

import { withLiveUpdate } from './drawTest'
import { getCave, getRandomRoom } from './roomRaster'

export function drawCaveLive(roomName?: string, depth?: number) {
  withLiveUpdate(() => {
    getCave(roomName, depth)
  })
}

export function drawCave(roomName?: string, depth?: number) {
  const cave = getCave(roomName, depth)
  initializeMap(cave)
}

export function drawRoom(roomName?: string, depth?: number) {
  const cave = getRandomRoom(roomName, depth)
  initializeMap(cave)
}
