import { loc, box } from '../../common/core/loc'

import { GameMap } from '../../common/game/Map'
import { Tile } from '../../common/world/tile'

import { getPlayer } from '../game/gameData'
import { NUM_COLS, NUM_ROWS } from './init'

export function render(map: GameMap) {
  // @ts-ignore
  window.gamemap = map
  const gameElement = document.getElementById('game')
  if (!gameElement) throw new Error('missing root game element')

  const children = (gameElement.querySelectorAll('div.cell') as NodeListOf<HTMLDivElement>)

  const renderBox = box(0, 0, NUM_COLS - 1, NUM_ROWS - 1)

  const iteratorBox = renderBox.intersect(map.tiles.box)

  for (const pt of iteratorBox) {
    const tile = map.get(pt)
    // This is normal
    // TODO: better viewport functions
    if (!tile) return
    const { x, y } = pt
    const idx = x + y * NUM_COLS
    const child = children[idx]
    // TODO: Error handling
    if (!child) return
    renderTileTo(tile, child)
  }

  const player = getPlayer()

  if (player.pt && iteratorBox.contains(player.pt)) {
    const { x, y } = player.pt
    const idx = x + y * NUM_COLS
    const child = children[idx]
    child.innerText = '@'
  }
}

function renderTileTo(tile: Tile, div: HTMLElement) {
  div.innerText = tile.glyph
  tile.isWallOuter() ? div.classList.add('outer-wall') : div.classList.remove('outer-wall')
  tile.isWallInner() ? div.classList.add('inner-wall') : div.classList.remove('inner-wall')
  tile.isPermanent() ? div.classList.add('perm-wall') : div.classList.remove('perm-wall')
  tile.isWallSolid() ? div.classList.add('solid-wall') : div.classList.remove('solid-wall')
}
