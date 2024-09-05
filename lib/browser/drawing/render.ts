import { Box, box, Loc } from '../../common/core/loc'

import { Cave } from '../../common/world/cave'
import { GameMap } from '../../common/game/Map'
import { Tile } from '../../common/world/tile'

import { getPlayer } from '../game/gameData'
import { NUM_COLS, NUM_ROWS } from './init'
import { Entity } from '../../common/game/Entity'

export const RENDER_BOX = box(0, 0, NUM_COLS - 1, NUM_ROWS - 1)

export function render(map: GameMap) {
  // @ts-ignore
  window.gamemap = map

  const player = getPlayer()

  renderMapToViewport(map, player)
  renderPlayer(map, player)
}

export function renderBare(map: Cave | GameMap) {
  renderMapToViewport(map)
}

export function renderChange(cave: Cave | GameMap, tile: Tile): boolean {
  return renderTileToViewport(cave, undefined, tile)
}

function getGameView(): NodeListOf<HTMLDivElement> {
  const gameElement = document.getElementById('game')
  if (!gameElement) throw new Error('missing root game element')
  return (gameElement.querySelectorAll('div.cell') as NodeListOf<HTMLDivElement>)
}

function renderTileToViewport(map: Cave | GameMap, player: Entity | undefined, tile: Tile): boolean {
  if (!map.isInbounds(tile.pt)) return false

  const children = getGameView()

  const renderBox = getRenderBox(map, player)
  const transform = renderBox.topLeft

  const toBasisCoords = basisCoordTransformer(transform)
  const basisCoords = toBasisCoords(tile.pt)
  if (!renderBox.contains(basisCoords)) return false

  for (let i = 0; i < children.length; i++) {
    children[i].classList.remove('editing')
  }

  const child = children[toDOM(basisCoords)]
  child.classList.add('editing')

  renderTileToDiv(tile, child)
  return true
}

function renderMapToViewport(map: Cave | GameMap, player?: Entity) {
  const children = getGameView()

  const renderBox = getRenderBox(map, player)
  const transform = renderBox.topLeft

  const toMapCoords = mapCoordTransformer(transform)

  for (const pt of RENDER_BOX) {
    const tile = map.isInbounds(pt) ? map.get(toMapCoords(pt)) : null
    const child = children[toDOM(pt)]
    // This is normal
    // TODO: better viewport functions
    if (!tile) {
      clearDiv(child)
    } else {
      renderTileToDiv(tile, child)
    }
  }
}

function renderPlayer(map: GameMap, player: Entity) {
  const children = getGameView()

  const renderBox = getRenderBox(map, player)
  const transform = renderBox.topLeft

  const toBasisCoords = basisCoordTransformer(transform)

  if (player.pt && renderBox.contains(player.pt)) {
    const idx = toDOM(toBasisCoords(player.pt))
    const child = children[idx]
    child.innerText = '@'
  }
}

type CoordTransformer = (pt: Loc) => Loc

function mapCoordTransformer(transform: Loc): CoordTransformer {
  return function (pt: Loc): Loc {
    return pt.sum(transform)
  }
}

function basisCoordTransformer(transform: Loc): CoordTransformer {
  return function (pt: Loc): Loc {
    return pt.diff(transform)
  }
}

function toDOM(pt: Loc): number {
  return pt.x + pt.y * NUM_COLS
}

// TODO: Maybe make a separate mode that always centers the player
function getRenderBox(map: Cave | GameMap, player?: Entity): Box {
  let left, right, top, bottom

  const playerBox = player && player.pt
    ? player.pt.box(NUM_ROWS, NUM_COLS)
    : RENDER_BOX

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
