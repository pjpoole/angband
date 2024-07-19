import { ParserFunction, ParserValues } from './Parser'
import { RF } from '../../common/monsters/flags'
import { ELEM } from '../../common/spells/elements'
import { MSG } from '../../common/game/messages'
import { C, colorStringToAttribute } from '../../common/utilities/colors'

type KeyOfType<T, V> = keyof {
    [P in keyof T as T[P] extends V? P: never]: any
}

// helper functions as separate objects
//
// the goal was to have these part of the Parser class, but I couldn't figure
// out a way to convince TS to restrict the input keys to those that match the
// type [P in keyof T as T[P] extends V] when they're actually a part of the
// class
//
// ergonomic goals:
// - always get warned if a key doesn't exist on the object
// - always get warned if the key's value's type differs from the return type
// - don't have to feed in the Spec to the generic each time <-- you are here
// - can auto-bind the function without using a HoF
export function keyToInteger<T>(key: KeyOfType<T, number>): ParserFunction {
  return function (value: ParserValues) {
    const current = this.current
    current[key] = valueAsInteger(value)
  }
}

export function keyToUnsigned<T>(key: KeyOfType<T, number>): ParserFunction {
  return function (value: ParserValues) {
    const current = this.current
    const int = valueAsInteger(value)
    if (int < 0) throw new Error('invalid value for unsigned int')
    current[key] = int
  }
}

export function keyToString<T>(key: KeyOfType<T, string>): ParserFunction {
  return function (value: ParserValues) {
    const current = this.current
    if (!current[key]) current[key] = ''
    current[key] += value
  }
}

export function keyToPercentile<T>(key: KeyOfType<T, number>): ParserFunction {
  return function (value: ParserValues) {
    const current = this.current
    let percentile = valueAsInteger(value)
    if (percentile < 1 || percentile > 100) throw new Error('invalid percentile value', { cause: { value } })

    // TODO: Figure out the logic here; could have some rounding issues
    //       this is original behavior, though
    // TODO: This will be a float; see if it needs to be clamped to an int
    current[key] = 100 / percentile
  }
}

export function keyToBoolean<T>(key: KeyOfType<T, boolean>): ParserFunction {
  return function (value: ParserValues) {
    const current = this.current
    current[key] = value === '1'
  }
}

export function keyToColor<T>(key: KeyOfType<T, C>): ParserFunction {
  return function (value: ParserValues) {
    const current = this.current
    current[key] = colorStringToAttribute(value)
  }
}

export function valueAsInteger(value: ParserValues): number {
  const number = parseInt(value)

  if (value !== String(number)) {
    throw new Error('invalid number value')
  }

  return number
}

export function valueAsRF(value: ParserValues): Set<RF> {
  const flags = value.split('|').map(el => el.trim())

  if (flags.some(flag => !(flag in RF))) {
    throw new Error('invalid flag')
  }

  return new Set(flags as unknown as RF[])
}

export function valueAsElem(value: ParserValues): ELEM {
  if (!(value in ELEM)) throw new Error('invalid flag')

  return value as unknown as ELEM
}

export function valueAsMsg(value: ParserValues): MSG {
  if (!(value in MSG)) throw new Error('invalid flag')

  return value as unknown as MSG
}
