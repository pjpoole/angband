import { Coord, cToWellOrdered } from '../core/coordinate'

export function stringRectangleToRaster<T extends string>(rect: Rectangle<T>): string {
  return stringRectangleToRows(rect).join('\n')
}

export function stringRectangleToRows<T extends string>(rect: Rectangle<T>): string[] {
  const results: string[][] = [[]]
  rect.forEach((char, pt, newRow) => {
    if (newRow) results.push([])
    results[results.length - 1].push(char)
  })

  return results.map(row => row.join(''))
}

type InitializerFn<T> = (pt: Coord) => T
type IteratorFn<T> = (obj: T, pt: Coord, newRow?: boolean) => void
type IteratorTestFn<T> = (obj: T, pt: Coord, newRow?: boolean) => boolean

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
      this.rect = Array.from({ length: height }, (_, y) => {
        return Array.from({ length: width }, (_, x) => {
          return (initializer as InitializerFn<T>)({ x, y })
        })
      })
    } else {
      this.rect = Array.from({ length: height }, () => {
        return Array.from({ length: width }, () => initializer as T)
      })
    }
  }

  get(pt: Coord): T {
    this.assertIsInbounds(pt)
    return this.rect[pt.y][pt.x]
  }

  set(pt: Coord, value: T) {
    this.assertIsInbounds(pt)
    this.rect[pt.y][pt.x] = value
  }

  *coordinates(p1: Coord, p2: Coord): IterableIterator<Coord>  {
    const [topLeft, bottomRight] = this.wellOrdered(p1, p2)

    const { x: left, y: top } = topLeft
    const { x: right, y: bottom } = bottomRight

    for (let y = top; y <= bottom; y++) {
      for (let x = left; x <= right; x++) {
        yield { x, y }
      }
    }
  }

  forEach(fn: IteratorFn<T>): void {
    this.forEachInRange({ x: 0, y: 0}, { x: this.mx, y: this.my }, fn)
  }

  every(p1: Coord, p2: Coord, fn: IteratorTestFn<T>): boolean {
    let prevY = 0
    let newRow = false
    for (const { x, y } of this.coordinates(p1, p2)) {
      if (y !== prevY) newRow = true
      if (!fn(this.rect[y][x], { x, y }, newRow)) return false

      newRow = false
      prevY = y
    }

    return true
  }

  forEachBorder(p1: Coord, p2: Coord, fn: IteratorFn<T>): void {
    const [topLeft, bottomRight] = this.wellOrdered(p1, p2)

    const { x: left, y: top } = topLeft
    const { x: right, y: bottom } = bottomRight

    let newRow = false
    for (let x = left; x <= right; x++) {
      fn(this.rect[top][x], { x, y: top }, newRow)
    }
    // NB. If width === 0, we don't run twice on each cell
    const leftRight = left === right ? [left] : [left, right]
    for (let y = top + 1; y < bottom; y++) {
      newRow = true
      for (const x of leftRight) {
        fn(this.rect[y][x], { x, y })
        newRow = false
      }
    }
    // NB. If height === 0, we don't run twice on each cell
    if (top === bottom) return
    newRow = true
    for (let x = left; x <= right; x++) {
      fn(this.rect[bottom][x], { x, y: bottom }, newRow)
      newRow = false
    }
  }

  forEachInRange(p1: Coord, p2: Coord, fn: IteratorFn<T>): void {
    let prevY = 0
    let newRow = false
    for (const { x, y } of this.coordinates(p1, p2)) {
      if (y !== prevY) newRow = true
      prevY = y
      fn(this.rect[y][x], { x, y }, newRow)

      newRow = false
    }
  }

  private wellOrdered(pt1: Coord, pt2: Coord): [Coord, Coord] {
    this.assertIsInbounds(pt1)
    this.assertIsInbounds(pt2)

    return cToWellOrdered(pt1, pt2)
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
