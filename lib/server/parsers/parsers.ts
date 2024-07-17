import { ParserFunction, ParserValues } from './Parser'
import { RF } from '../../common/monsters/flags'

export function keyToInteger<T>(key: keyof T): ParserFunction {
  return function (value: ParserValues) {
    const current = this.current
    current[key] = valueAsInteger(value)
  }
}

export function keyToUnsigned<T>(key: keyof T): ParserFunction {
  return function (value: ParserValues) {
    const current = this.current
    const int = valueAsInteger(value)
    if (int < 0) throw new Error('invalid value for unsigned int')
    current[key] = int
  }
}

export function keyToString<T>(key: keyof T): ParserFunction {
  return function (value: ParserValues) {
    const current = this.current
    if (!current[key]) current[key] = ''
    current[key] += value
  }
}

export function keyToPercentile<T>(key: keyof T): ParserFunction {
  return function (value: ParserValues) {
    const current = this.current
    let percentile = valueAsInteger(value)
    if (percentile < 1 || percentile > 100) throw new Error('invalid percentile value', { cause: { value } })

    // TODO: Figure out the logic here; could have some rounding issues
    //       this is original behavior, though
    current[key] = 100 / percentile
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
