import { getFileEntries, getGameDataPath } from './loading/loading'
import { writeGameData } from './loading/writing'

import { ParserDerived } from './parsers/Parser'
import { GameObject } from '../common/GameObject'
import { SerializableBase } from '../common/core/serializable'
import { BlowParser, DungeonProfileParser, FeatureParser, WorldParser } from './parsers'
import { ConstantsParser } from './parsers/ConstantsParser'

async function doParse<A extends string, B extends GameObject, C extends SerializableBase, D extends GameObject>(cls: ParserDerived<A, B, C, D>) {
  const parser = new cls()

  await getFileEntries(getFilePath(cls), parser)
  checkForParserError(parser)
  parser.finalize()

  await writeGameData(cls.fileName, cls.registry.toJSON())
}

async function parseConstants() {
  const parser = new ConstantsParser()

  console.log(`${ConstantsParser.name}: running...`)
  await getFileEntries(getFilePath(ConstantsParser), parser)
  checkForParserError(parser)

  try {
    await parser.finalize()
    console.log(`${ConstantsParser.name}: done`)
  } catch (e) {
    console.log(`${ConstantsParser.name}: failed`)
    throw e
  }
}

function getFilePath(cls: { fileName: string}): string {
  const fileName = cls.fileName

  if (fileName == null) throw new Error('no filename specified')

  return getGameDataPath(fileName)
}

function checkForParserError(parser: { error?: Error }) {
  if (parser.error) {
    if (parser.error.cause) console.log(parser.error.cause)
    throw parser.error
  }
}

const parsers: any[] = [
  BlowParser,
  DungeonProfileParser,
  WorldParser,
  FeatureParser
]

;(async () => {
  await parseConstants()

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
