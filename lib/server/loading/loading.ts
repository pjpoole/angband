import * as fs from 'node:fs/promises'
import * as path from 'node:path'

import { type Parser } from '../parsers/Parser'
import type { GameObject } from '../../common/GameObject'

/*
 * Directories
 */
// TODO: make this work with dynamic path
// TODO: make pathing work on any system
const USER_DIR = path.join('/Users', 'pjpoole')
export const DATA_DIR = path.join(USER_DIR, 'Documents', 'Angband')
export const PROJECTS_DIR = path.resolve(__dirname, '..', '..', '..')

const GAMEDATA_BASE = path.join('angband', 'angband', 'lib', 'gamedata')
export const GAMEDATA_DIR = path.join(PROJECTS_DIR, GAMEDATA_BASE)

export function getGameDataPath(fileName: string): string {
  return path.join(GAMEDATA_DIR, fileName)
}

export function getDocumentsPath(fileName: string): string {
  return path.join(DATA_DIR, fileName)
}

export async function getFileEntries<S extends string, T extends GameObject>(filePath: string, parser: Parser<S, T>): Promise<void | Error> {
  const fileHandle = await fs.open(filePath, 'r')

  let lineNo = 0

  // TODO: keep track of where errors happen; line + col
  for await (const line of fileHandle.readLines({ encoding: 'utf8' })) {
    lineNo++
    if (line.startsWith('#') || line === '') {
      continue
    }
    const firstColon = line.indexOf(':')
    if (firstColon === -1 || firstColon + 1 === line.length) {
      // TODO: ParserError
      const error = new Error('invalid line', {
        cause: { file: filePath, line: lineNo, data: line } })
      parser.error = error
      return error
    }

    const key = line.substring(0, firstColon)
    const rest = line.substring(firstColon + 1)

    try {
      parser.parse(key, rest)
    } catch (e) {
      parser.error = new Error('parser error', { cause: { file: filePath, line: lineNo, data: line, error: e }})
    }
  }
}
