import type { GameObject } from '../GameObject'
import { JsonArray } from '../utilities/json'
import { SerializableBase } from './serializable'

export class Registry<T extends SerializableBase, U extends GameObject> {
  readonly data: Map<string, T> = new Map()

  constructor(private readonly ctor: new (params: U) => T) {
    this.ctor = ctor
  }

  get(key: string): T | undefined {
    return this.data.get(key)
  }

  build(key: string, data: U): void {
    const obj = new this.ctor(data)
    this.add(key, obj)
  }

  add(key: string, obj: T): void {
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
