import { getFileEntries, getGameDataPath } from './loading/loading'
import { writeGameData } from './loading/writing'

import { ParserDerived } from './parsers/Parser'
import { GameObject } from '../common/GameObject'
import { SerializableBase } from '../common/core/serializable'
import { DungeonProfileParser, FeatureParser, WorldParser } from './parsers'

async function doParse<A extends string, B extends GameObject, C extends SerializableBase, D extends GameObject>(cls: ParserDerived<A, B, C, D>) {
  const parser = new cls()
  const fileName = cls.fileName

  if (fileName == null) throw new Error('no filename specified')

  await getFileEntries(getGameDataPath(fileName), parser)
  if (parser.error) {
    if (parser.error.cause) console.log(parser.error.cause)
    throw parser.error
  }
  parser.finalize()

  await writeGameData(cls.fileName, cls.registry.toJSON())
}

const parsers: any[] = [
  DungeonProfileParser,
  WorldParser,
  FeatureParser
]

;(async () => {
  for (const parser of parsers) {
    console.log(`${parser.name}: running...`)
    try {
      await doParse(parser)
      console.log(`${parser.name}: done`)
    } catch (e) {
      console.log(`${parser.name}: failed`)
      throw e
    }
  }
})()
