import { valueAsInteger } from './parsers'
import { C, colorStringToAttribute } from '../../common/utilities/colors'

export type ParserValues = string

export type ParserFunction = (values: ParserValues) => void

type KeyOfType<T, U> = keyof { [K in keyof T as NonNullable<T[K]> extends U ? K : never]: T[K] }

export abstract class ParserBase<S, T extends { [K in keyof T]: any }> {
  private _error?: Error
  private _handlers: Map<S, ParserFunction> = new Map()
  private _objects: T[] = []
  private _current: T | null = null

  parse(key: S, value: ParserValues): void {
    const handler = this._handlers.get(key)
    if (!handler) {
      throw new Error('no handler for key', { cause: { key } })
    }
    handler(value)
  }

  abstract finalize(): void

  register(key: S, handler: ParserFunction): void {
    this._handlers.set(key, handler)
  }

  get objects(): T[] {
    return this._objects as T[]
  }

  newCurrent(): Partial<T> {
    if (this._current) {
      this.finalizeCurrent()
    }

    this._current = {} as T
    return this._current
  }

  get current(): T {
    if (this._current == null) throw new Error('missing record header')
    return this._current
  }

  finalizeCurrent(): void {
    if (this._current != null) this._objects.push(this._current)
  }

  set error(err: Error) {
    this._error = err
  }

  get error(): Error | undefined {
    return this._error
  }
}

export abstract class Parser<S, T> extends ParserBase<S, T> {
  keyToInteger(key: KeyOfType<T, number>): ParserFunction {
    return (value: ParserValues): void => {
      const current = this.current
      const parsed = valueAsInteger(value)
      current[key] = parsed as T[typeof key]
    }
  }

  keyToUnsigned(key: KeyOfType<T, number>): ParserFunction {
    return (value: ParserValues) => {
      const current = this.current
      const int = valueAsInteger(value)
      if (int < 0) throw new Error('invalid value for unsigned int')
      current[key] = int as T[typeof key]
    }
  }

  keyToString(key: KeyOfType<T, string>): ParserFunction {
    return (value: ParserValues): void => {
      const current = this.current
      current[key] = value as T[typeof key]
    }
  }

  keyToPercentile(key: KeyOfType<T, number>): ParserFunction {
    return (value: ParserValues) => {
      const current = this.current
      let percentile = valueAsInteger(value)
      if (percentile < 1 || percentile > 100) throw new Error(
        'invalid percentile value',
        { cause: { value } }
      )

      // TODO: Figure out the logic here; could have some rounding issues
      //       this is original behavior, though
      // TODO: This will be a float; see if it needs to be clamped to an int
      current[key] = (100 / percentile) as T[typeof key]
    }
  }

  keyToBoolean(key: KeyOfType<T, boolean>): ParserFunction {
    return (value: ParserValues) => {
      const current = this.current
      current[key] = (value === '1') as T[typeof key]
    }
  }

  keyToColor(key: KeyOfType<T, C>): ParserFunction {
    return (value: ParserValues): void => {
      const current = this.current
      const c = colorStringToAttribute(value)
      current[key] = c as T[typeof key]
    }
  }
}
