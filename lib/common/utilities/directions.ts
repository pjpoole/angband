import { Coord, cSum } from '../core/coordinate'
import { randInt0 } from '../core/rand'

export enum DIR {
  SOUTHWEST = 1,
  SOUTH,
  SOUTHEAST,
  WEST,
  REST,
  EAST,
  NORTHWEST,
  NORTH,
  NORTHEAST,
}

export function moveDir(pt: Coord, direction: DIR) {
  return cSum(pt, dirToCoord(direction))
}

export function randDirNSEW(): Coord {
  const [x, y] = M_NP_XY[randInt0(4)]
  return { x, y }
}

export function dirToCoord(direction: DIR): Coord {
  const [x, y] = NP_XY[direction]
  return { x, y }
}

// S, N, E, W; SE, SW, NE, NW; rest
export const NP_KEYS = [2, 8, 6, 4, 3, 1, 9, 7, 5] as const

// if I press a numpad key above, what direction will that move me?
// delta x, delta y
export const NP_X = [0, -1, 0, 1, -1, 0, 1, -1, 0, 1] as const
export const NP_Y = [0, 1, 1, 1, 0, 0, 0, -1, -1, -1] as const

// zip the two previous arrays to make coordinates
export const NP_XY = [
  [0, 0], [-1, 1], [0, 1], [1, 1], [-1, 0],
  [0, 0], [1, 0], [-1, -1], [0, -1], [1, -1],
] as const

// NP_X[NP_KEYS[i]]; mapped NP_X; NP_Y[NP_KEYS[i]]; mapped NP_Y
export const M_NP_X = [0, 0, 1, -1, 1, -1, 1, -1, 0] as const
export const M_NP_Y = [1, -1, 0, 0, 1, 1, -1, -1, 0] as const

// zip the previous two to make coordinates
export const M_NP_XY = [
  [0, 1], [0, -1], [1, 0], [-1, 0], [1, 1],
  [-1, 1], [1, -1], [-1, -1], [0, 0]
] as const
