const fs = require('fs')
const path = require('path')

const PROJECTS_DIR = path.resolve(__dirname, '..', '..', '..')
const GAMEDATA_DIR = 'angband/angband/lib/gamedata'

const BASE_FILE = path.join(PROJECTS_DIR, GAMEDATA_DIR, 'monster_base.txt')
const DATA_FILE = path.join(PROJECTS_DIR, GAMEDATA_DIR, 'monster.txt')

const ALL_FIELDS = new Set()
const ALL_FLAGS = new Set()
const ALL_MONSTERS = new Map()
const BASE_MONSTERS = new Map()

const chunks = parseFile(BASE_FILE)
console.log(chunks.length)
console.log(chunks[0])

function parseFile(filePath) {
  const data = fs.readFileSync(filePath, 'utf8')
  const chunks = dataToChunks(data)
  const items = chunksToItems(chunks)

  return items
}

/**
 * Chunks a file into items (e.g. monsters)
 *
 * @param {string} baseData
 */
function dataToChunks(baseData) {
  const chunks = []
  let started = false
  let current = []
  // filter out comments
  for (const line of baseData.split('\n').filter(line => !line.startsWith('#'))) {
    if (line === '') {
      if (!started) continue
      chunks.push(current)
      current = []
    } else {
      started = true
      current.push(line)
    }
  }

  return chunks
}

function chunksToItems(chunks) {
  return chunks.map((chunk) => {
    const item = {}
    for (const line of chunk) {
      const [key, values] = lineToTokens(line)
      item[key] ? item[key].push(...values) : item[key] = values
    }
    return item
  })
}

function lineToTokens(line) {
  const [key, valueString] = line.split(':')
  const values = valueString.split(/\s+\|\s+/)
  return [key, values]
}
