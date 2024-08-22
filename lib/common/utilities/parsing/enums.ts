import { NativeEnum } from '../enum'
import { PARSE_ERROR_INVALID_FLAG } from '../../core/errors'

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
