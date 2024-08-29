export function loc(x: number, y: number): Loc {
  return new Loc(x, y)
}

export function locsToBox(p1: Loc, p2: Loc): Box {
  return box(...wellOrder(p1, p2))
}

export function box(left: number, top: number, right: number, bottom: number): Box {
  return new Box(left, top, right, bottom)
}

export function wellOrdered(p1: Loc, p2: Loc): [Loc, Loc] {
  const [left, top, right, bottom] = wellOrder(p1, p2)
  return [loc(left, top), loc(right, bottom)]
}

// Temp functions for compatibility
/*** BEGIN ***/
export function toExteriorBox(p1: Loc, p2: Loc): [Loc, Loc] {
  const [min, max] = wellOrdered(p1, p2)
  return [min.offset(-1), max.offset(1)]
}

export function* locIterate(p1: Loc, p2: Loc): IterableIterator<Loc> {
  const [left, top, right, bottom] = wellOrder(p1, p2)

  for (let y = top; y <= bottom; y++) {
    for (let x = left; x <= bottom; x++) {
      yield loc(x, y)
    }
  }
}
/***  END  ***/

function wellOrder(p1: Loc, p2: Loc): [number, number, number, number] {
  return [
    Math.min(p1.x, p2.x),
    Math.min(p1.y, p2.y),
    Math.max(p1.x, p2.x),
    Math.max(p1.y, p2.y),
  ]
}

export class Loc {
  readonly x: number
  readonly y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  sum(p: Loc): Loc {
    return loc(this.x + p.x, this.y + p.y)
  }

  diff(p: Loc): Loc {
    return loc(this.x - p.x, this.y - p.y)
  }

  prod(n: number): Loc {
    return loc(this.x * n, this.y * n)
  }

  eq(p: Loc): boolean {
    return this.x === p.x && this.y === p.y
  }

  distX(p: Loc): number {
    return Math.abs(this.x - p.x)
  }

  distY(p: Loc): number {
    return Math.abs(this.y - p.y)
  }

  tr(x: number, y: number): Loc {
    return loc(this.x + x, this.y + y)
  }

  trX(x: number): Loc {
    return loc(this.x + x, this.y)
  }

  trY(y: number): Loc {
    return loc(this.x, this.y + y)
  }

  offset(n: number): Loc {
    return loc(this.x + n, this.y + n)
  }

  box(height: number, width?: number): Box {
    width ??= height
    const l = this.x - Math.trunc(width / 2)
    const t = this.y - Math.trunc(width / 2)
    const r = l + width - 1
    const b = t + height - 1
    return box(l, t, r, b)
  }

  boxR(radius: number) {
    return this.box(radius * 2 + 1)
  }

  boxCorners(height: number, width?: number): [Loc, Loc] {
    width ??= height
    const l = this.x - Math.trunc(width / 2)
    const t = this.y - Math.trunc(height / 2)
    const r = l + width - 1
    const b = t + height - 1
    return [loc(l, t), loc(r, b)]
  }

  boxToRadius(radius: number): [Loc, Loc] {
    return this.boxCorners(radius * 2 + 1)
  }
}

export class Box {
  readonly l: number
  readonly t: number
  readonly r: number
  readonly b: number

  constructor(left: number, top: number, right: number, bottom: number) {
    this.l = left
    this.t = top
    this.r = right
    this.b = bottom
  }

  get left() {
    return this.l
  }

  get top() {
    return this.t
  }

  get right() {
    return this.r
  }

  get bottom() {
    return this.b
  }

  get width() {
    return this.r - this.l + 1
  }

  get height() {
    return this.b - this.t + 1
  }

  extents(): [Loc, Loc] {
    return [loc(this.l, this.t), loc(this.b, this.r)]
  }

  center(): Loc {
    return loc(
      Math.trunc((this.l + this.r) / 2),
      Math.trunc((this.t + this.b) / 2),
    )
  }

  surrounds(b: Box): boolean {
    return this.l <= b.l && b.r <= this.r && this.t <= b.t && b.b <= this.b
  }

  contains(p: Loc): boolean {
    return p.x >= this.l && p.x <= this.r && p.y >= this.t && p.y <= this.b
  }

  fullyContains(p: Loc): boolean {
    return p.x > this.l && p.x < this.r && p.y > this.t && p.y < this.b
  }

  interior(): Box {
    return box(this.l + 1, this.t + 1, this.r - 1, this.b - 1)
  }

  exterior(): Box {
    return box(this.l - 1, this.t - 1, this.r + 1, this.b + 1)
  }

  *[Symbol.iterator](): IterableIterator<Loc> {
    for (let y = this.t; y <= this.b; y++) {
      for (let x = this.l; x <= this.r; x++) {
        yield loc(x, y)
      }
    }
  }
}
