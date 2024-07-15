const fs = require('fs')
const path = require('path')

const PROJECTS_DIR = path.resolve(__dirname, '..', '..', '..')
const DATA_DIR = path.join('/Users', 'pjpoole', 'Documents', 'Angband')
const GAMEDATA_DIR = 'angband/angband/lib/gamedata'

const BASE_FILE = path.join(PROJECTS_DIR, GAMEDATA_DIR, 'monster_base.txt')
const DATA_FILE = path.join(PROJECTS_DIR, GAMEDATA_DIR, 'monster.txt')
const LORE_FILE = path.join(DATA_DIR, 'lore.txt')

const ALL_FLAGS = new Set()
const ALL_MONSTERS = new Map()
const BASE_MONSTERS = new Map()

const ARRAY = Symbol('Array')
const COLON = Symbol('Colon')
const LONG_STRING = Symbol('LongString')
const NUMBER = Symbol('Number')
const STRING = Symbol('String')

const KEY_TYPES = {
  'armor-class': NUMBER,
  base: STRING,
  blow: COLON,
  color: STRING,
  'color-cycle': STRING, // undocumented in monster.txt
  depth: NUMBER,
  desc: LONG_STRING,
  drop: COLON,
  'drop-base': COLON,
  experience: NUMBER,
  flags: ARRAY,
  'flags-off': ARRAY,
  friends: COLON,
  'friends-base': COLON,
  glyph: STRING,
  hearing: NUMBER,
  'hit-points': NUMBER,
  'innate-freq': NUMBER,
  light: NUMBER,
  'message-invis': COLON,
  'message-miss': COLON,
  'message-vis': COLON,
  mimic: COLON,
  name: STRING,
  pain: NUMBER,
  plural: STRING,
  rarity: NUMBER,
  shape: ARRAY, // undocumented in monster.txt
  sleepiness: NUMBER,
  smell: NUMBER, // undocumented in monster.txt
  speed: NUMBER,
  'spell-freq': NUMBER,
  'spell-power': NUMBER,
  spells: ARRAY,
}

const monsterBases = parseFile(BASE_FILE)
const monsters = parseFile(DATA_FILE)

const enriched = monsters.map(monster => enrichMonster(monster))

const lore = parseFile(LORE_FILE)

for (const monster of enriched) {
  for (const flag of monster.flags) {
    ALL_FLAGS.add(flag)
  }
  console.log(monster.name)
}
console.log(Array.from(ALL_FLAGS).sort())
console.log(enriched.length)



function enrichMonster(monster) {
  const base = getBase(monster.base)

  if (base == null) throw new Error(`could not find monster base type: ${monster.base}`)
  if (base.flags == null) base.flags = new Set()

  monster.glyph = monster.glyph || base.glyph
  monster.pain = monster.pain || base.pain

  const monsterFlagsOff = monster['flags-off'] || new Set()
  const monsterFlags = monster.flags || new Set()

  baseFlags = setDifference(base.flags, monsterFlagsOff)
  monster.flags = setUnion(baseFlags, monsterFlags)

  return monster
}

function setDifference(set1, set2) {
  const result = new Set()
  for (const key of set1.keys()) {
    if (!set2.has(key)) result.add(key)
  }

  return result
}

function setUnion(set1, set2) {
  const result = new Set(set1)

  for (const key of set2.keys()) {
    result.add(key)
  }

  return result
}

function getBase(type) {
  return monsterBases.find((el) => el.name === type)
}

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
  // eat multiple empty lines
  let currentPopulated = false
  let current = []
  // filter out comments
  for (const line of baseData.split('\n').filter(line => !line.startsWith('#'))) {
    if (line === '') {
      if (!started) continue
      if (!currentPopulated) continue
      chunks.push(current)
      current = []
      currentPopulated = false
    } else {
      started = true
      currentPopulated = true
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

      switch (KEY_TYPES[key]) {
        case ARRAY:
          if (!item[key]) item[key] = new Set()
          for (const value of values) {
            item[key].add(value)
          }
          break
        case LONG_STRING:
          item[key] ? item[key].push(...values) : item[key] = values
          break
        case COLON:
          item[key] ? item[key].push(values) : item[key] = [values]
          break
        case NUMBER:
          item[key] = parseInt(values[0])
          break
        case STRING:
          item[key] = values[0]
          break
        default:
          throw new Error(`Unexpected key type '${key}' in monster item`)
      }
    }

    for (const [key, value] of Object.entries(item)) {
      switch (KEY_TYPES[key]) {
        case LONG_STRING:
          item[key] = value.join(' ').replace(/(?<!\.) {2,}/g, ' ')
          break
      }
    }

    return item
  })
}

function lineToTokens(line) {
  const [key, ...valueString] = line.split(':')
  const values = KEY_TYPES[key] === COLON ? valueString : valueString[0].split('|').map(flag => flag.trim())
  return [key, values]
}
