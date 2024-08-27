import { Coord } from '../core/coordinate'

export function initRect<T>(height: number, width: number, value?: T): T[][] {
  const result: T[][] = new Array(height)
  for (let y = 0; y < height; y++) {
    result[y] = new Array(width)
    if (value !== undefined) {
      for (let x = 0; x < width; x++) {
        result[y][x] = value
      }
    }
  }

  return result
}

export function initRectWith<T>(
  height: number,
  width: number,
  fn: (x: number, y: number) => T
): T[][] {
  const result: T[][] = new Array(height)
  for (let y = 0; y < height; y++) {
    result[y] = new Array(width)
    for (let x = 0; x < width; x++) {
      result[y][x] = fn(x, y)
    }
  }

  return result
}

type InitializerFn<T> = (pt: Coord) => T
type IteratorFn<T> = (obj: T, pt: Coord) => void

export class Rectangle<T> {
  readonly height: number
  readonly width: number
  readonly rect: T[][]

  private readonly mx: number
  private readonly my: number

  constructor(height: number, width: number, initializer: T | InitializerFn<T>) {
    this.height = height
    this.width = width

    // memoizing array upper bounds
    this.mx = this.width - 1
    this.my = this.height - 1

    if (typeof initializer === 'function') {
      this.rect = Array.from({ length: height }, (_, x) => {
        return Array.from({ length: width }, (_, y) => {
          return (initializer as InitializerFn<T>)({ x, y })
        })
      })
    } else {
      this.rect = Array.from({ length: height }, (_, x) => {
        return Array.from({ length: width }, (_, y) => initializer as T)
      })
    }
  }

  get(pt: Coord): T | undefined {
    return this.rect[pt.y][pt.x]
  }

  set(pt: Coord, value: T) {
    this.assertIsInbounds(pt)
    this.rect[pt.y][pt.x] = value
  }

  eachCell(fn: IteratorFn<T>): void {
    this.eachCellInRange({ x: 0, y: 0}, { x: this.mx, y: this.my }, fn)
  }

  eachBorderCell(p1: Coord, p2: Coord, fn: IteratorFn<T>): void {
    const [topLeft, bottomRight] = this.wellOrdered(p1, p2)

    const { x: left, y: top } = topLeft
    const { x: right, y: bottom } = bottomRight

    for (let x = left; x <= right; x++) {
      fn(this.rect[top][x], { x, y: top })
    }
    // NB. If width === 0, we don't run twice on each cell
    const leftRight = left === right ? [left] : [left, right]
    for (let y = top + 1; y < bottom; y++) {
      for (const x of leftRight) {
        fn(this.rect[y][x], { x, y })
      }
    }
    // NB. If height === 0, we don't run twice on each cell
    if (top === bottom) return
    for (let x = left; x <= right; x++) {
      fn(this.rect[bottom][x], { x, y: bottom })
    }
  }

  eachCellInRange(p1: Coord, p2: Coord, fn: IteratorFn<T>): void {
    const [topLeft, bottomRight] = this.wellOrdered(p1, p2)

    const { x: left, y: top } = topLeft
    const { x: right, y: bottom } = bottomRight

    for (let y = top; y <= bottom; y++) {
      for (let x = left; x <= right; x++) {
        fn(this.rect[y][x], { x, y })
      }
    }
  }

  private wellOrdered(pt1: Coord, pt2: Coord): [Coord, Coord] {
    this.assertIsInbounds(pt1)
    this.assertIsInbounds(pt2)

    return [
      { x: Math.min(pt1.x, pt2.x), y: Math.min(pt1.y, pt2.y) },
      { x: Math.max(pt1.x, pt2.x), y: Math.max(pt1.y, pt2.y) },
    ]
  }

  assertIsInbounds(pt: Coord) {
    if (!this.isInbounds(pt)) throw new Error(
      'invalid coordinates',
      { cause: { x: pt.x, y: pt.y }}
    )
  }

  isInbounds(pt: Coord): boolean {
    return pt.x >= 0 && pt.x < this.width && pt.y >= 0 && pt.y < this.height
  }

  isFullyInbounds(pt: Coord): boolean {
    return pt.x > 0 && pt.x < this.mx && pt.y > 0 && pt.y < this.my
  }
}
