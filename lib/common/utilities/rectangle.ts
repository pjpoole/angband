import { Box, box, loc, Loc, wellOrdered } from '../core/loc'

export function stringRectangleToRaster<T extends string>(rect: Rectangle<T>): string {
  return stringRectangleToRows(rect).join('\n')
}

export function stringRectangleToRows<T extends string>(rect: Rectangle<T>): string[] {
  const results: string[][] = [[]]
  rect.forEach((char, p, newRow) => {
    if (newRow) results.push([])
    results[results.length - 1].push(char)
  })

  return results.map(row => row.join(''))
}

type InitializerFn<T> = (pt: Loc) => T
type IteratorFn<T> = (obj: T, pt: Loc, newRow?: boolean) => void
type IteratorTestFn<T> = (obj: T, pt: Loc, newRow?: boolean) => boolean

export class Rectangle<T> {
  readonly height: number
  readonly width: number
  readonly rect: T[][]
  readonly box: Box

  private readonly mx: number
  private readonly my: number

  constructor(height: number, width: number, initializer: T | InitializerFn<T>) {
    this.height = height
    this.width = width

    // memoizing array upper bounds
    this.mx = this.width - 1
    this.my = this.height - 1

    this.box = box(0, 0, this.mx, this.my)

    if (typeof initializer === 'function') {
      this.rect = Array.from({ length: height }, (_, y) => {
        return Array.from({ length: width }, (_, x) => {
          return (initializer as InitializerFn<T>)(loc(x, y))
        })
      })
    } else {
      this.rect = Array.from({ length: height }, () => {
        return Array.from({ length: width }, () => initializer as T)
      })
    }
  }

  get(pt: Loc): T {
    this.assertIsInbounds(pt)
    return this.rect[pt.y][pt.x]
  }

  set(pt: Loc, value: T) {
    this.assertIsInbounds(pt)
    this.rect[pt.y][pt.x] = value
  }

  *coordinates(p1: Loc, p2: Loc): IterableIterator<Loc>  {
    const [topLeft, bottomRight] = this.wellOrdered(p1, p2)

    const { x: left, y: top } = topLeft
    const { x: right, y: bottom } = bottomRight

    for (let y = top; y <= bottom; y++) {
      for (let x = left; x <= right; x++) {
        yield loc(x, y)
      }
    }
  }

  forEach(fn: IteratorFn<T>): void {
    this.forEachInRange(...this.box.extents(), fn)
  }

  every(p1: Loc, p2: Loc, fn: IteratorTestFn<T>): boolean {
    let prevY = 0
    let newRow = false
    for (const p of this.coordinates(p1, p2)) {
      if (p.y !== prevY) newRow = true
      if (!fn(this.rect[p.y][p.x], p, newRow)) return false

      newRow = false
      prevY = p.y
    }

    return true
  }

  forEachBorder(p1: Loc, p2: Loc, fn: IteratorFn<T>): void {
    const [topLeft, bottomRight] = this.wellOrdered(p1, p2)

    const { x: left, y: top } = topLeft
    const { x: right, y: bottom } = bottomRight

    let newRow = false
    for (let x = left; x <= right; x++) {
      fn(this.rect[top][x], loc(x, top), newRow)
    }
    // NB. If width === 0, we don't run twice on each cell
    const leftRight = left === right ? [left] : [left, right]
    for (let y = top + 1; y < bottom; y++) {
      newRow = true
      for (const x of leftRight) {
        fn(this.rect[y][x], loc(x, y))
        newRow = false
      }
    }
    // NB. If height === 0, we don't run twice on each cell
    if (top === bottom) return
    newRow = true
    for (let x = left; x <= right; x++) {
      fn(this.rect[bottom][x], loc(x, bottom), newRow)
      newRow = false
    }
  }

  forEachInRange(p1: Loc, p2: Loc, fn: IteratorFn<T>): void {
    let prevY = 0
    let newRow = false
    for (const p of this.coordinates(p1, p2)) {
      if (p.y !== prevY) newRow = true
      prevY = p.y
      fn(this.rect[p.y][p.x], p, newRow)

      newRow = false
    }
  }

  private wellOrdered(p1: Loc, p2: Loc): [Loc, Loc] {
    this.assertIsInbounds(p1)
    this.assertIsInbounds(p2)

    return wellOrdered(p1, p2)
  }

  assertIsInbounds(p: Loc) {
    if (!this.isInbounds(p)) throw new Error(
      'invalid coordinates',
      { cause: { x: p.x, y: p.y }}
    )
  }

  isInbounds(p: Loc): boolean {
    return this.box.contains(p)
  }

  isFullyInbounds(p: Loc): boolean {
    return this.box.fullyContains(p)
  }
}
