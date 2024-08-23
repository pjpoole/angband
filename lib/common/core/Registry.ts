import type { GameObject } from '../GameObject'
import { JsonArray } from '../utilities/json'
import { SerializableBase } from './serializable'

// TEMP: setting Map to key by number because I want to enforce the use of enum
// values, not keys, everywhere
//
// I suspect that in time I'll find this assumption violated
export class Registry<
  T extends SerializableBase, U extends GameObject, V extends string | number
> implements Iterable<[V, T]> {
  readonly data: Map<V, T> = new Map()
  private _sealed: boolean = false

  constructor(protected readonly ctor: new (params: U) => T) {
    this.ctor = ctor
  }

  finalize(): void {
    this.seal()
  }

  seal(): boolean {
    const notYetSealed = !this._sealed
    this._sealed = true
    return notYetSealed
  }

  *[Symbol.iterator](): IterableIterator<[V, T]> {
    yield* this.data
  }

  has(key: unknown): boolean {
    return this.data.has(key as V)
  }

  get(key: V): T | undefined {
    if (!this._sealed) {
      throw new Error(
        'registry read before sealing',
        { cause: { registry: this.ctor.name }}
      )
    }

    return this.data.get(key)
  }

  getById(id: number): T | undefined {
    if (!this._sealed) {
      throw new Error(
        'registry read before sealing',
        { cause: { registry: this.ctor.name }}
      )
    }

    for (const el of this.data.values()) {
      if (el.id === id) return el
    }
  }

  getOrThrow(key: any): T {
    const result = this.data.get(key)
    if (result) return result

    throw new Error('value not found', { cause: { key }})
  }

  build(key: V, data: U): void {
    const obj = new this.ctor(data)
    this.add(key, obj)
  }

  add(key: V, obj: T): void {
    if (this._sealed) {
      throw new Error('attempt to register new value after registry sealed')
    }
    this.data.set(key, obj)
  }

  // TODO: make this determine its type from its contained class
  toJSON(): JsonArray {
    const result = []

    for (const value of this.data.values()) {
      result.push(value.toJSON())
    }

    return result
  }
}

export class NameRegistry<
  T extends SerializableBase, U extends GameObject
> extends Registry<T, U, string> {}

export class IdRegistry<
  T extends SerializableBase, U extends GameObject
> extends Registry<T, U, number> {}
