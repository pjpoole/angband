import type { GameObject } from '../GameObject'
import { JsonArray } from '../utilities/json'
import { SerializableBase } from './serializable'

// TEMP: setting Map to key by number because I want to enforce the use of enum
// values, not keys, everywhere
//
// I suspect that in time I'll find this assumption violated
export class Registry<
  T extends SerializableBase, U extends GameObject, V extends string | number
> implements Iterable<T> {
  readonly data: Map<V, T> = new Map()
  private _sealed: boolean = false

  constructor(protected readonly ctor: new (params: U) => T) {
    this.ctor = ctor
  }

  finalize(): boolean {
    return this.seal()
  }

  private seal(): boolean {
    const notYetSealed = !this._sealed
    this._sealed = true
    return notYetSealed
  }

  *[Symbol.iterator](): IterableIterator<T> {
    this.assertSealed()
    yield* this.data.values()
  }

  has(key: unknown): boolean {
    return this.data.has(key as V)
  }

  getSafe(key: V): T | undefined {
    this.assertSealed()
    return this.data.get(key)
  }

  get(key: any): T {
    this.assertSealed()
    const result = this.data.get(key)
    if (result) return result

    throw new Error('value not found', { cause: { key }})
  }

  getById(id: number): T | undefined {
    this.assertSealed()
    for (const el of this.data.values()) {
      if (el.id === id) return el
    }
  }

  add(key: V, obj: T): void {
    this.assertNotSealed()
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

  private assertSealed() {
    if (!this._sealed) {
      throw new Error(
        'registry accessed before sealing',
        { cause: { registry: this.ctor.name }}
      )
    }
  }

  private assertNotSealed() {
    if (this._sealed) {
      throw new Error('modifying registry after sealing')
    }
  }
}

export class NameRegistry<
  T extends SerializableBase, U extends GameObject
> extends Registry<T, U, string> {}

export class IdRegistry<
  T extends SerializableBase, U extends GameObject
> extends Registry<T, U, number> {}
