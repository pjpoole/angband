import type { GameObject } from '../GameObject'

export class Registry<T, U extends GameObject> {
  private data: Map<string, T> = new Map()

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
}
