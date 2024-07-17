import { ParserFunction, ParserValues } from './Parser'
import { RF } from '../../common/monsters/flags'

export function keyToInteger<T>(key: keyof T): ParserFunction {
  return function (value: ParserValues) {
    const current = this.current
    current[key] = valueAsInteger(value)
  }
}

export function keyToString<T>(key: keyof T): ParserFunction {
  return function (value: ParserValues) {
    const current = this.current
    if (!current[key]) current[key] = ''
    current[key] += value
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
