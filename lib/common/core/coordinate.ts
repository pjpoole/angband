export interface Coord {
  x: number
  y: number
}

export function cSum(pt1: Coord, pt2: Coord) {
  return { x: pt1.x + pt2.x, y: pt1.y + pt2.y }
}
