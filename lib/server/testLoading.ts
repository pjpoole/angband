import { getFileEntries, getGameDataPath } from './loading/loading'
import { writeGameData } from './loading/writing'

import { Parser, ParserDerived } from './parsers/Parser'
import { GameObject } from '../common/GameObject'
import { SerializableBase } from '../common/core/serializable'
import { FeatureParser, WorldParser } from './parsers'

async function doParse<A extends string, B extends GameObject, C extends SerializableBase, D extends GameObject>(cls: ParserDerived<A, B, C, D>) {
  const parser = new cls()
  await getFileEntries(getGameDataPath(cls.fileName), parser)
  if (parser.error) {
    if (parser.error.cause) console.log(parser.error.cause)
    throw parser.error
  }
  parser.finalize()

  writeGameData(cls.fileName, cls.registry.toJSON())
}

const parsers: any[] = [
  WorldParser,
  FeatureParser
]

for (const parser of parsers) {
  console.log(`running ${parser.name}...`)
  doParse(parser)
    .then(() => {
      console.log('done')
    })
    .catch(() => {
      console.log(`failed to run ${parser.name}`)
    })
}
