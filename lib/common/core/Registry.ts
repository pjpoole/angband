import type { GameObject } from '../GameObject'
import { JsonArray } from '../utilities/json'
import { SerializableBase } from './serializable'

// TEMP: setting Map to key by number because I want to enforce the use of enum
// values, not keys, everywhere
//
// I suspect that in time I'll find this assumption violated
export class Registry<T extends SerializableBase, U extends GameObject, V extends string | number> {
  readonly data: Map<V, T> = new Map()

  constructor(protected readonly ctor: new (params: U) => T) {
    this.ctor = ctor
  }

  get(key: V): T | undefined {
    return this.data.get(key)
  }

  build(key: V, data: U): void {
    const obj = new this.ctor(data)
    this.add(key, obj)
  }

  add(key: V, obj: T): void {
    this.data.set(key, obj)
  }

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
