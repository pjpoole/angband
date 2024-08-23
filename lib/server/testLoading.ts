import { getFileEntries, getGameDataPath } from './loading/loading'
import { writeGameData } from './loading/writing'

import { ParserDerived } from './parsers/Parser'
import { GameObject } from '../common/GameObject'
import { PARSERS } from './parsers'
import { ConstantsParser } from './parsers/ConstantsParser'
import { Registry } from '../common/core/Registry'

async function doParse<
  A extends string, B extends GameObject, C extends Registry<any, any, any>
>(cls: ParserDerived<A, B>, registry: C) {
  const parser = new cls()

  await getFileEntries(getFilePath(cls), parser)
  checkForParserError(parser)
  parser.finalize()

  registry.seal()
  const data = registry.toJSON()

  await writeGameData(cls.fileName, data)
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

;(async () => {
  await parseConstants()

  for (const [parser, registry] of PARSERS) {
    console.log(`${parser.name}: running...`)
    try {
      await doParse(parser, registry)
      console.log(`${parser.name}: done`)
    } catch (e) {
      console.log(`${parser.name}: failed`)
      throw e
    }
  }
})()
