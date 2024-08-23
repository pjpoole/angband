import { Parser } from './Parser'
import {
  asInteger,
  asTokens,
  ParserValues
} from '../../common/utilities/parsing/primitives'

import { Level, LevelJSON } from '../../common/world/level'

type WorldFields = 'level'

export class WorldParser extends Parser<WorldFields, LevelJSON> {
  static readonly fileName = 'world'

  constructor() {
    super()

    this.register('level', this.handleLevel.bind(this))
  }

  _finalizeItem(obj: LevelJSON) {
    Level.fromJSON(obj).register()
  }

  handleLevel(value: ParserValues) {
    const current = this.newCurrent()
    const [rawDepth, name, up, down] = asTokens(value, 4)

    current.depth = asInteger(rawDepth)
    current.name = name
    current.up = up === "None" ? undefined : up
    current.down = down === "None" ? undefined : down
  }
}
