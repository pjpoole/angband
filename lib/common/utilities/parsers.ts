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

  if (value.trim() !== String(number)) {
    throw new Error(PARSE_ERROR_INVALID_NUMBER)
  }

  return number
}

export function asBoolean(value: ParserValues): boolean {
  return value === '1'
}

export function asEnum<T extends NativeEnum>(
  key: string,
  enumObject: T
): keyof T {
  if (!Object.keys(enumObject).includes(key)) {
    throw new Error(PARSE_ERROR_INVALID_FLAG)
  }

  return key as keyof T
}

export function maybeAsEnum<T extends NativeEnum>(
  key: string,
  enumObject: T
): keyof T | undefined {
  if (!Object.keys(enumObject).includes(key)) return undefined
  return key as keyof T
}

export function allAsEnum<T extends NativeEnum>(
  keyString: string,
  enumObject: T
): Array<keyof T> {
  const keys = keyString.split('|').map(el => el.trim())

  // handle auto-generated reverse mapping
  const enumKeys = new Set(Object.keys(enumObject).filter(val => typeof val === 'string'))
  if (!keys.every(key => enumKeys.has(key))) {
    throw new Error(PARSE_ERROR_INVALID_FLAG)
  }

  return keys as Array<keyof T>
}

export function asTokens(str: string, count: number): string[]
export function asTokens(str: string, min: number, max: number): string[]
export function asTokens(str: string, minOrCount: number, max?: number): string[] {
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
