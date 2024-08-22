import {
  PARSE_ERROR_INVALID_NUMBER,
  PARSE_ERROR_INVALID_OPTION
} from '../../core/errors'

export type ParserValues = string

export function asArrayMember<T>(value: unknown, ary: readonly T[]): T {
  if (!ary.includes(value as any)) {
    throw new Error(PARSE_ERROR_INVALID_OPTION)
  }

  return value as T
}

export function asInteger(value: ParserValues): number {
  const number = parseInt(value)

  if (value.trim() !== String(number)) {
    throw new Error(PARSE_ERROR_INVALID_NUMBER)
  }

  return number
}

export function asBoolean(value: ParserValues): boolean {
  return value === '1'
}

export function asTokens(str: string, count: number): string[]
export function asTokens(str: string, min: number, max: number): string[]
export function asTokens(
  str: string,
  minOrCount: number,
  max?: number
): string[] {
  max ??= minOrCount

  const strings = str.split(':')

  if (strings.length < minOrCount || strings.length > max) {
    throw new Error(
      'invalid tokens',
      { cause: { min: minOrCount, max, actual: strings.length, value: str } }
    )
  }

  return strings
}

export function asFlags(str: string): string[] {
  return str.split('|').map(el => el.trim())
}
