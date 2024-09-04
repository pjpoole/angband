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

  const viewport = box(0, 0, NUM_COLS - 1, NUM_ROWS - 1)
  const renderBox = getRenderBox(map, player)

  const transform = renderBox.topLeft

  function toMapCoords(pt: Loc): Loc { return pt.sum(transform) }
  function toBasisCoords(pt: Loc): Loc { return pt.diff(transform) }

  function toDOM(pt: Loc) {
    return pt.x + pt.y * NUM_COLS
  }

  for (const pt of viewport) {
    const tile = map.get(toMapCoords(pt))
    const child = children[toDOM(pt)]
    // This is normal
    // TODO: better viewport functions
    if (!tile) {
      clearDiv(child)
    } else {
      renderTileToDiv(tile, child)
    }
  }

  if (player.pt && renderBox.contains(player.pt)) {
    const idx = toDOM(toBasisCoords(player.pt))
    const child = children[idx]
    child.innerText = '@'
  }
}

// TODO: Maybe make a separate mode that always centers the player
function getRenderBox(map: GameMap, player: Entity): Box {
  let left, right, top, bottom

  const playerBox = player.pt
    ? player.pt.box(NUM_ROWS, NUM_COLS)
    : box(0, 0, NUM_COLS - 1, NUM_ROWS - 1)

  // if the map is too small, or the player is too close to the edge, cap the box
  if (map.width < NUM_COLS) {
    left = 0
    right = NUM_COLS - 1
  } else {
    if (playerBox.left < 0) {
      left = 0
      right = playerBox.right + playerBox.left
    } else if (playerBox.right > map.box.right) {
      right = map.box.right
      left = playerBox.left - (playerBox.right - map.box.right)
    } else {
      left = playerBox.left
      right = playerBox.right
    }
  }

  if (map.height < NUM_ROWS) {
    top = 0
    bottom = NUM_ROWS - 1
  } else {
    if (playerBox.top < 0) {
      top = 0
      bottom = playerBox.bottom + playerBox.top
    } else if (playerBox.bottom > map.box.bottom) {
      bottom = map.box.bottom
      top = playerBox.top - (playerBox.bottom - map.box.bottom)
    } else {
      top = playerBox.top
      bottom = playerBox.bottom
    }
  }

  return box(left, top, right, bottom)
}

function clearDiv(div: HTMLElement) {
  div.innerText = ''
  // TODO: better way to do this; maybe make divs in divs
  div.classList.remove('solid-wall', 'inner-wall', 'outer-wall', 'perm-wall')
}

function renderTileToDiv(tile: Tile, div: HTMLElement) {
  div.innerText = tile.glyph
  tile.isWallSolid() ? div.classList.add('solid-wall') : div.classList.remove('solid-wall')
  tile.isWallInner() ? div.classList.add('inner-wall') : div.classList.remove('inner-wall')
  tile.isWallOuter() ? div.classList.add('outer-wall') : div.classList.remove('outer-wall')
  tile.isPermanent() ? div.classList.add('perm-wall') : div.classList.remove('perm-wall')
}
