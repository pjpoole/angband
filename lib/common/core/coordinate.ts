export interface Coord {
  x: number
  y: number
}

export function cSum(pt1: Coord, pt2: Coord) {
  return { x: pt1.x + pt2.x, y: pt1.y + pt2.y }
}

export function cOffset(pt: Coord, offset: number) {
  return { x: pt.x + offset, y: pt.y + offset }
}

export function cProd(pt: Coord, multiplicand: number) {
  return { x: pt.x * multiplicand, y: pt.y * multiplicand }
}
