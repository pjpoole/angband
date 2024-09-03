export function loc(x: number, y: number): Loc {
  return new Loc(x, y)
}

export function box(left: number, top: number, right: number, bottom: number): Box {
  return new Box(left, top, right, bottom)
}

export class Loc {
  readonly x: number
  readonly y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  // integer distance approximation
  dist(p: Loc): number {
    const dx = Math.abs(this.x - p.x)
    const dy = Math.abs(this.y - p.y)

    return dy > dx ? dy + (dx >> 1) : dx + (dy >> 1)
  }

  sum(p: Loc): Loc {
    return loc(this.x + p.x, this.y + p.y)
  }

  diff(p: Loc): Loc {
    return loc(this.x - p.x, this.y - p.y)
  }

  mult(n: number): Loc {
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

  isOnEdge(b: Box): boolean {
    return this.x === b.l || this.x === b.r || this.y === b.t || this.y === b.b
  }

  isCorner(b: Box): boolean {
    return (this.x === b.l || this.x === b.r) && (this.y === b.t || this.y === b.b)
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

  get topLeft(): Loc {
    return loc(this.l, this.t)
  }

  get topRight(): Loc {
    return loc(this.r, this.t)
  }

  get bottomLeft(): Loc {
    return loc(this.l, this.b)
  }

  get bottomRight(): Loc {
    return loc(this.r, this.b)
  }

  get width() {
    return this.r - this.l + 1
  }

  get height() {
    return this.b - this.t + 1
  }

  get size() {
    return this.width * this.height
  }

  tr(p: Loc): Box {
    return box(this.l + p.x, this.t + p.y, this.r + p.x, this.b + p.y)
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

  union(b: Box): Box {
    return box(
      Math.min(this.l, b.l),
      Math.min(this.t, b.t),
      Math.max(this.r, b.r),
      Math.max(this.b, b.b),
    )
  }

  intersect(b: Box): Box {
    return box(
      Math.max(this.l, b.l),
      Math.max(this.t, b.t),
      Math.min(this.r, b.r),
      Math.min(this.b, b.b),
    )
  }

  contains(p: Loc): boolean {
    return p.x >= this.l && p.x <= this.r && p.y >= this.t && p.y <= this.b
  }

  fullyContains(p: Loc): boolean {
    return p.x > this.l && p.x < this.r && p.y > this.t && p.y < this.b
  }

  interior(i: number = 1): Box {
    return box(this.l + i, this.t + i, this.r - i, this.b - i)
  }

  exterior(i: number = 1): Box {
    return box(this.l - i, this.t - i, this.r + i, this.b + i)
  }

  *corners(): IterableIterator<Loc> {
    const leftRight = this.l === this.r ? [this.l] : [this.l, this.r]
    const topBottom = this.t === this.b ? [this.t] : [this.t, this.b]

    for (const x of leftRight) {
      for (const y of topBottom) {
        yield loc(x, y)
      }
    }
  }

  *borders(): IterableIterator<Loc> {
    for (let x = this.l; x <= this.r; x++) {
      yield loc(x, this.t)
    }
    // NB. If width === 0, we don't run twice on each cell
    const leftRight = this.l === this.r ? [this.l] : [this.l, this.r]
    for (let y = this.t + 1; y < this.b; y++) {
      for (const x of leftRight) {
        yield loc(x, y)
      }
    }
    // NB. If height === 0, we don't run twice on each cell
    if (this.t === this.b) return
    for (let x = this.l; x <= this.r; x++) {
      yield loc(x, this.b)
    }
  }

  *[Symbol.iterator](): IterableIterator<Loc> {
    for (let y = this.t; y <= this.b; y++) {
      for (let x = this.l; x <= this.r; x++) {
        yield loc(x, y)
      }
    }
  }
}
