import { GameObject } from '../../common/GameObject'

export type ParserValues = string

export type ParserFunction = (values: ParserValues) => void

export abstract class Parser<T extends GameObject> {
  private _error: Error
  private _handlers: Map<keyof T, ParserFunction>
  private _objects: Partial<T>[]
  private _current: Partial<T> | null = null

  parse(key: keyof T, value: ParserValues): void {
    const handler = this._handlers.get(key)
    if (!handler) {
      throw new Error('no handler for key', { cause: { key } })
    }
    handler(value)
  }

  abstract finalize(): void

  register(key: keyof T, handler: ParserFunction): void {
    this._handlers.set(key, handler)
  }

  get objects(): T[] {
    return this._objects as T[]
  }

  hasCurrent(): boolean {
    return this._current != null
  }

  newCurrent(): Partial<T> {
    this._current = {}
    return this._current
  }

  get current(): Partial<T> {
    return this._current
  }

  finalizeCurrent(): void {
    this._objects.push(this._current)
  }

  set error(err: Error) { this._error = err }
  get error(): Error { return this._error }
}
