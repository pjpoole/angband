import { loc, Loc } from '../core/loc'
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

export function moveDir(pt: Loc, direction: DIR) {
  return pt.sum(dirToCoord(direction))
}

export function randDirNSEW(): Loc {
  return loc(...M_NP_XY[randInt0(4)])
}

export function dirToCoord(direction: DIR): Loc {
  return loc(...NP_XY[direction])
}

export function* getNeighbors(pt: Loc, includeSelf?: boolean) {
  const limit = includeSelf ? 9 : 8
  for (let i = 0; i < limit; i++) {
    yield pt.sum(dirToCoord(NP_KEYS[i]))
  }
}

// S, N, E, W; SE, SW, NE, NW; rest
export const NP_KEYS = [2, 8, 6, 4, 3, 1, 9, 7, 5] as const

// if I press a numpad key above, what direction will that move me?
// delta x, delta y
export const NP_X = [0, -1, 0, 1, -1, 0, 1, -1, 0, 1] as const
export const NP_Y = [0, 1, 1, 1, 0, 0, 0, -1, -1, -1] as const

// zip the two previous arrays to make coordinates
export const NP_XY: [number, number][] = [
  [0, 0], [-1, 1], [0, 1], [1, 1], [-1, 0],
  [0, 0], [1, 0], [-1, -1], [0, -1], [1, -1],
] as const

// NP_X[NP_KEYS[i]]; mapped NP_X; NP_Y[NP_KEYS[i]]; mapped NP_Y
export const M_NP_X = [0, 0, 1, -1, 1, -1, 1, -1, 0] as const
export const M_NP_Y = [1, -1, 0, 0, 1, 1, -1, -1, 0] as const

// zip the previous two to make coordinates
export const M_NP_XY: [number, number][] = [
  [0, 1], [0, -1], [1, 0], [-1, 0], [1, 1],
  [-1, 1], [1, -1], [-1, -1], [0, 0]
] as const
