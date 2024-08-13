import {
  PARSE_ERROR_INVALID_FLAG,
  PARSE_ERROR_INVALID_NUMBER,
  PARSE_ERROR_INVALID_OPTION
} from '../core/errors'

export type ParserValues = string

export function asArrayMember<T>(value: unknown, ary: readonly T[]): T {
  if (!ary.includes(value as any)) {
    throw new Error(PARSE_ERROR_INVALID_OPTION)
  }

  return value as T
}

export function asInteger(value: ParserValues): number {
  const number = parseInt(value)

  if (value !== String(number)) {
    throw new Error(PARSE_ERROR_INVALID_NUMBER)
  }

  return number
}

export function asEnum<T extends Record<string, string | number>>(
  value: unknown,
  enumObject: T
): keyof T {
  if (typeof value !== 'string' || !(value in enumObject)) {
    throw new Error(PARSE_ERROR_INVALID_FLAG)
  }

  return value
}

export function allAsEnum<T extends Record<string, string | number>>(
  str: string,
  enumObject: T
): Array<keyof T> {
  const values = str.split('|').map(el => el.trim())

  if (!values.every(value => value in enumObject)) {
    throw new Error(PARSE_ERROR_INVALID_FLAG)
  }

  return values
}
