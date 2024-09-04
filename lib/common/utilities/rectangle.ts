import { Box, box, loc, Loc } from '../core/loc'
import { randInRange } from '../core/rand'

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

interface TransformParams {
  translate?: Loc
  reflect?: boolean
  rotate?: number
}

export class Rectangle<T> {
  readonly height: number
  readonly width: number
  private readonly rect: T[][]
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
    this.assertContains(pt)
    return this.rect[pt.y][pt.x]
  }

  set(pt: Loc, value: T) {
    this.assertContains(pt)
    this.rect[pt.y][pt.x] = value
  }

  *coordinates(b?: Box): IterableIterator<Loc>  {
    b == null ? b = this.box : this.assertSurrounds(b)
    yield* b
  }

  *randomly(b?: Box): IterableIterator<Loc> {
    b == null ? b = this.box : this.assertSurrounds(b)

    const size = b.size
    const width = b.width
    let seen = 0
    const permute = new Array(size)

    while (seen !== size) {
      // choose the index of an item to swap out of the remaining entries
      const roll = randInRange(seen, size)
      const farIdx = seen + roll
      // grab the value there. If it hasn't been initialized, use the value
      // itself
      const value = permute[farIdx] ?? farIdx
      // move the current value to the far index
      permute[farIdx] = permute[seen] ?? seen
      // and bring the value from the far index here
      permute[seen] = value
      seen++
      yield loc((value % width) + b.left, Math.trunc(value / width) + b.top)
    }
  }

  transform(options: TransformParams, fn: IteratorFn<T>): void {
    const rotate = (options.rotate ?? 0) % 4
    const reflect = options.reflect ?? false
    const { x: left, y: top } = options.translate ?? loc(0, 0)

    const r = this.mx
    const b = this.my

    let xMinT = 0, xMaxT = r, yMin = 0, yMax = b
    switch (rotate) {
      case 0:
        [xMinT, xMaxT, yMin, yMax] = [0, r, 0, b]
        break
      case 1:
        [xMinT, xMaxT, yMin, yMax] = [b, 0, 0, r]
        break
      case 2:
        [xMinT, xMaxT, yMin, yMax] = [r, 0, b, 0]
        break
      case 3:
        [xMinT, xMaxT, yMin, yMax] = [0, b, r, 0]
        break
    }

    const xMin = reflect ? xMaxT : xMinT
    const xMax = reflect ? xMinT : xMaxT
    const xd = xMin <= xMax ? 1 : -1
    const yd = yMin <= yMax ? 1 : -1

    let newRow = false
    for (let y = yMin; y !== yMax + yd; y += yd) {
      for (let x = xMin; x !== xMax + xd; x += xd) {
        fn(this.rect[y][x], loc(x + left, y + top), newRow)
        newRow = false
      }
      newRow = true
    }
  }

  forEach(fn: IteratorFn<T>): void
  forEach(b: Box, fn: IteratorFn<T>): void
  forEach(fnOrBox: Box | IteratorFn<T>, maybeFn?: IteratorFn<T>): void {
    const b = maybeFn == null ? this.box : fnOrBox as Box
    const fn = maybeFn ?? fnOrBox as IteratorFn<T>

    let prevY = 0
    let newRow = false
    for (const p of this.coordinates(b)) {
      if (p.y !== prevY) newRow = true
      prevY = p.y
      fn(this.rect[p.y][p.x], p, newRow)

      newRow = false
    }
  }

  every(b: Box, fn: IteratorTestFn<T>): boolean {
    let prevY = 0
    let newRow = false
    for (const p of this.coordinates(b)) {
      if (p.y !== prevY) newRow = true
      if (!fn(this.rect[p.y][p.x], p, newRow)) return false

      newRow = false
      prevY = p.y
    }

    return true
  }

  forEachBorder(fn: IteratorFn<T>): void
  forEachBorder(b: Box, fn: IteratorFn<T>): void
  forEachBorder(fnOrBox: Box | IteratorFn<T>, maybeFn?: IteratorFn<T>): void {
    const b = maybeFn == null ? this.box : fnOrBox as Box
    const fn = maybeFn ?? fnOrBox as IteratorFn<T>

    this.assertSurrounds(b)

    let newRow = false
    let prevY = b.top
    for (const p of b.borders()) {
      if (p.y !== prevY) {
        newRow = true
        prevY = p.y
      }
      fn(this.rect[p.y][p.x], p, newRow)
    }
  }

  assertContains(p: Loc) {
    if (!this.contains(p)) {
      const { l, t, r, b } = this.box
      throw new Error(
        'invalid coordinates',
        {
          cause: {
            point: { x: p.x, y: p.y },
            self: { l, t, r, b }
          }
        }
      )
    }
  }

  assertSurrounds(bx: Box) {
    if (!this.surrounds(bx)) {
      const { left, top, right, bottom } = bx
      const { l, t, r, b } = this.box
      throw new Error(
        'invalid coordinates',
        {
          cause: {
            box: { l: left, t: top, r: right, b: bottom },
            self: { l, t, r, b },
          }
        }
      )
    }
  }

  intersect(b: Box): Box {
    return this.box.intersect(b)
  }

  surrounds(b: Box): boolean {
    return this.box.surrounds(b)
  }

  contains(p: Loc): boolean {
    return this.box.contains(p)
  }

  fullyContains(p: Loc): boolean {
    return this.box.fullyContains(p)
  }
}
