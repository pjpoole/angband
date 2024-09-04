import { Loc } from '../../common/core/loc'
import { randEl } from '../../common/core/rand'

import { GameMap } from '../../common/game/Map'
import { Cave } from '../../common/world/cave'

import { render } from '../drawing/render'

import { getPlayer, setMap } from './gameData'
import { getCave } from '../testing/roomRaster'

export function initializeMap(cave?: Cave) {
  cave ??= getCave()
  const map = new GameMap(cave)
  setMap(map)
  const player = getPlayer()
  const position = getOpenPosition(cave)
  player.add(map, position)
  render(map)
}


function getOpenPosition(cave: Cave): Loc {
  const openPoints: Loc[] = []
  cave.tiles.forEach((tile, pt, newRow) => {
    if (tile.isOpen()) openPoints.push(pt)
  })

  return randEl(openPoints)
}
