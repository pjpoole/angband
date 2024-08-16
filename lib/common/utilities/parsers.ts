import {
  PARSE_ERROR_INVALID_FLAG,
  PARSE_ERROR_INVALID_NUMBER,
  PARSE_ERROR_INVALID_OPTION
} from '../core/errors'
import { NativeEnum } from './enum'

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

export function asBoolean(value: ParserValues): boolean {
  return value === '1'
}

export function asEnum<T extends NativeEnum>(
  value: string,
  enumObject: T
): keyof T {
  if (!Object.keys(enumObject).includes(value)) {
    throw new Error(PARSE_ERROR_INVALID_FLAG)
  }

  return value as keyof T
}

export function allAsEnum<T extends NativeEnum>(
  str: string,
  enumObject: T
): Array<keyof T> {
  const values = str.split('|').map(el => el.trim())

  // handle auto-generated reverse mapping
  const enumValues = new Set(Object.keys(enumObject).filter(val => typeof val === 'string'))
  if (!values.every(value => enumValues.has(value))) {
    throw new Error(PARSE_ERROR_INVALID_FLAG)
  }

  return values as Array<keyof T>
}
