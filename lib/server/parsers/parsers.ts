import { ParserValues } from './Parser'
import { RF } from '../../monsters/flags'

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
