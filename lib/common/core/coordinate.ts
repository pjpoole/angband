export interface Coord {
  x: number
  y: number
}

export function cEq(pt1: Coord, pt2: Coord): boolean {
  return pt1.x === pt2.x && pt1.y === pt2.y
}

export function cSum(pt1: Coord, pt2: Coord): Coord {
  return { x: pt1.x + pt2.x, y: pt1.y + pt2.y }
}

export function cCenter(pt1: Coord, pt2: Coord): Coord {
  return {
    x: Math.trunc((pt1.x + pt2.x) / 2),
    y: Math.trunc((pt1.y + pt2.y) / 2),
  }
}

export function cOffset(pt: Coord, offset: number): Coord {
  return { x: pt.x + offset, y: pt.y + offset }
}

export function cToExteriorBox(pt1: Coord, pt2: Coord): [Coord, Coord] {
  const [min, max] = cToWellOrdered(pt1, pt2)

  return [cOffset(min, -1), cOffset(max, 1)]
}

export function cToWellOrdered(pt1: Coord, pt2: Coord): [Coord, Coord] {
  return [
    { x: Math.min(pt1.x, pt2.x), y: Math.min(pt1.y, pt2.y) },
    { x: Math.max(pt1.x, pt2.x), y: Math.max(pt1.y, pt2.y) }
  ]
}

export function cProd(pt: Coord, multiplicand: number): Coord {
  return { x: pt.x * multiplicand, y: pt.y * multiplicand }
}

/*
 * left-biased boxing of centers
 * center 5, width 7: [2, 3, 4, 5, 6, 7, 8]
 *                     center --^
 *
 * center 5, width 8: [1, 2, 3, 4, 5, 6, 7, 8]
 *                        center --^
 */
export function cToBox(center: Coord, height: number): [Coord, Coord]
export function cToBox(center: Coord, height: number, width: number): [Coord, Coord]
export function cToBox(center: Coord, height: number, width?: number): [Coord, Coord] {
  width ??= height

  const pt1 = {
    x: center.x - Math.trunc(width / 2),
    y: center.y - Math.trunc(height / 2)
  }

  // -1 because the box includes all members
  const pt2 = {
    x: pt1.x + width - 1,
    y: pt1.y + height - 1
  }

  return [pt1, pt2]
}

export function cToRadius(pt: Coord, radius: number): [Coord, Coord] {
  return cToBox(pt, radius * 2 + 1)
}
