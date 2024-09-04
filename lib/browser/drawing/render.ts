import { Box, box, Loc } from '../../common/core/loc'

import { GameMap } from '../../common/game/Map'
import { Tile } from '../../common/world/tile'

import { getPlayer } from '../game/gameData'
import { NUM_COLS, NUM_ROWS } from './init'
import { Entity } from '../../common/game/Entity'

export function render(map: GameMap) {
  // @ts-ignore
  window.gamemap = map
  const gameElement = document.getElementById('game')
  if (!gameElement) throw new Error('missing root game element')

  const children = (gameElement.querySelectorAll('div.cell') as NodeListOf<HTMLDivElement>)

  const player = getPlayer()

  const renderBox = getRenderBox(player)

  const iteratorBox = renderBox.intersect(map.tiles.box)
  const transform = iteratorBox.topLeft

  function translate(pt: Loc) {
    return pt.x - transform.x + (pt.y - transform.y) * NUM_COLS
  }

  for (const pt of iteratorBox) {
    const tile = map.get(pt)
    // This is normal
    // TODO: better viewport functions
    if (!tile) return
    const idx = translate(pt)
    const child = children[idx]
    // TODO: Error handling
    if (!child) return
    renderTileTo(tile, child)
  }

  if (player.pt && iteratorBox.contains(player.pt)) {
    const idx = translate(player.pt)
    const child = children[idx]
    child.innerText = '@'
  }
}

function getRenderBox(player: Entity): Box {
  return player.pt
    ? player.pt.box(NUM_ROWS, NUM_COLS)
    : box(0, 0, NUM_COLS - 1, NUM_ROWS - 1)
}

function renderTileTo(tile: Tile, div: HTMLElement) {
  div.innerText = tile.glyph
  tile.isWallSolid() ? div.classList.add('solid-wall') : div.classList.remove('solid-wall')
  tile.isWallInner() ? div.classList.add('inner-wall') : div.classList.remove('inner-wall')
  tile.isWallOuter() ? div.classList.add('outer-wall') : div.classList.remove('outer-wall')
  tile.isPermanent() ? div.classList.add('perm-wall') : div.classList.remove('perm-wall')
}
