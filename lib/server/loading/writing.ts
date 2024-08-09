import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { JsonValue } from '../../common/utilities/json'

const ROOT_DIR = path.resolve(__dirname, '..', '..', '..')
const DATA_DIR = path.join(ROOT_DIR, 'lib', 'gamedata')

export async function writeGameData(fileName: string, data: JsonValue) {
  const jsonFileName = fileName.endsWith('.json') ? fileName : `${fileName}.json`

  const dataString = JSON.stringify(data, null, 2)

  await fs.writeFile(path.join(DATA_DIR, jsonFileName), dataString, { encoding: 'utf-8' })
}
