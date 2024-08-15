import type { GameObject } from '../GameObject'
import { JsonArray } from '../utilities/json'
import { SerializableBase } from './serializable'

// TEMP: setting Map to key by number because I want to enforce the use of enum
// values, not keys, everywhere
//
// I suspect that in time I'll find this assumption violated
export class Registry<T extends SerializableBase, U extends GameObject> {
  readonly data: Map<number, T> = new Map()

  constructor(private readonly ctor: new (params: U) => T) {
    this.ctor = ctor
  }

  get(key: number): T | undefined {
    return this.data.get(key)
  }

  build(key: number, data: U): void {
    const obj = new this.ctor(data)
    this.add(key, obj)
  }

  add(key: number, obj: T): void {
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
