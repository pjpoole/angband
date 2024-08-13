import { getFileEntries, getGameDataPath } from './loading/loading'
import { writeGameData } from './loading/writing'

import { ParserDerived } from './parsers/Parser'
import { FeatureParser } from './parsers/FeatureParser'
import { GameObject } from '../common/GameObject'
import { SerializableBase } from '../common/core/serializable'

async function doParse<A extends string, B extends GameObject, C extends SerializableBase>(cls: ParserDerived<A, B, C>) {
  const parser = new cls()
  await getFileEntries(getGameDataPath(cls.fileName), parser)
  parser.finalize()

  writeGameData(cls.fileName, cls.registry.toJSON())
}

const parsers = [
  FeatureParser
]

for (const parser of parsers) {
  console.log(`running ${parser.name}...`)
  doParse(parser)
}
