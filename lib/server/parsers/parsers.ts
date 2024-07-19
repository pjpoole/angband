import { ParserValues } from './Parser'
import { RF } from '../../common/monsters/flags'
import { ELEM } from '../../common/spells/elements'
import { MSG } from '../../common/game/messages'

export function valueIsInArray<T>(value: unknown, ary: readonly T[]): value is T {
  return ary.includes(value as any)
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
