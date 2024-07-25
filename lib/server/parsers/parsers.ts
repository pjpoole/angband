import { ParserValues } from './Parser'
import {
  PARSE_ERROR_INVALID_FLAG,
  PARSE_ERROR_INVALID_NUMBER,
  PARSE_ERROR_INVALID_OPTION
} from '../../common/core/errors'

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
): T[keyof T] {
  if (!Object.values(enumObject).includes(value as T[keyof T])) {
    throw new Error(PARSE_ERROR_INVALID_FLAG)
  }

  return value as T[keyof T]
}

export function allAsEnum<T extends Record<string, string | number>>(
  str: string,
  enumObject: T
): Set<T[keyof T]> {
  const values = str.split('|').map(el => el.trim())

  const enumValues = new Set(Object.values(enumObject))
  if (!values.every(value => enumValues.has(value as T[keyof T]))) {
    throw new Error(PARSE_ERROR_INVALID_FLAG)
  }

  return new Set(values as Array<T[keyof T]>)
}
